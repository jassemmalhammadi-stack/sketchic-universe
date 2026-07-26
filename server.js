const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf'
};

const { exec } = require('child_process');

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD; // if not set in environment, bypass basic authentication

function checkAuth(req) {
    if (!ADMIN_PASS) return true; // Bypass authentication locally if no password is configured
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') return false;
    
    const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
    const [user, pass] = decoded.split(':');
    
    return user === ADMIN_USER && pass === ADMIN_PASS;
}

const server = http.createServer((req, res) => {
    // Enforce basic auth if configured
    if (!checkAuth(req)) {
        res.writeHead(401, {
            'WWW-Authenticate': 'Basic realm="Sketchic Admin Area"',
            'Content-Type': 'text/plain; charset=utf-8'
        });
        res.end('Access Denied: Invalid Credentials. يرجى إدخال اسم المستخدم وكلمة المرور الصحيحة للوصول للوحة التحكم.');
        return;
    }

    console.log(`${req.method} ${req.url}`);
    
    // API to export public assets and auto-push to GitHub
    if (req.method === 'POST' && req.url === '/api/publish') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFile(path.join(PUBLIC_DIR, 'public_assets.json'), JSON.stringify(data, null, 4), 'utf8', (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: err.message }));
                        return;
                    }
                    
                    const siblingDir = path.join(PUBLIC_DIR, '..', 'sketchic');
                    const siblingJSON = path.join(siblingDir, 'public_assets.json');

                    // Write to sibling public repo
                    fs.writeFile(siblingJSON, JSON.stringify(data, null, 4), 'utf8', (sibErr) => {
                        if (sibErr) {
                            console.error('Failed to write to sibling public assets:', sibErr);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                success: true, 
                                pushed: false, 
                                error: 'تعذر الكتابة في مجلد البوابة العامة المجاور (sketchic). تأكد من أن المجلد موجود في بيئة العمل.' 
                            }));
                            return;
                        }

                        // Copy latest index.html, portal.js, style.css, logo.jpg to sibling root
                        try {
                            fs.copyFileSync(path.join(PUBLIC_DIR, 'index.html'), path.join(siblingDir, 'index.html'));
                            fs.copyFileSync(path.join(PUBLIC_DIR, 'js', 'portal.js'), path.join(siblingDir, 'portal.js'));
                            fs.copyFileSync(path.join(PUBLIC_DIR, 'css', 'style.css'), path.join(siblingDir, 'style.css'));
                            if (fs.existsSync(path.join(PUBLIC_DIR, 'assets', 'logo.jpg'))) {
                                fs.copyFileSync(path.join(PUBLIC_DIR, 'assets', 'logo.jpg'), path.join(siblingDir, 'logo.jpg'));
                            }
                        } catch (copyErr) {
                            console.error('Failed to sync sibling templates:', copyErr);
                        }

                        // Attempt Git commit and push inside sibling public repo folder
                        const gitCmd = 'git add public_assets.json index.html portal.js style.css logo.jpg && git commit -m "Auto-update public assets from production hub" && git push';
                        exec(gitCmd, { cwd: siblingDir }, (gitErr, stdout, stderr) => {
                            if (gitErr) {
                                console.error('Git auto-push failed for sibling repo:', gitErr, stderr);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ 
                                    success: true, 
                                    pushed: false, 
                                    error: 'تعذر التحديث التلقائي في GitHub لمستودع البوابة العامة. تأكد من تهيأة مستودع Git في مجلد sketchic وربطه عن بعد (Remote).' 
                                }));
                                return;
                            }
                            console.log('Git auto-push succeeded for sibling repo:', stdout);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, pushed: true }));
                        });
                    });
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON body' }));
            }
        });
        return;
    }
    
    // Normalize URL and resolve path
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'admin.html' : req.url);
    
    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 403;
        res.end('Access Denied');
        return;
    }
    
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Serve admin.html for SPA fallback if file not found (excluding assets)
            const ext = path.extname(filePath);
            if (!ext || ext === '.html') {
                filePath = path.join(PUBLIC_DIR, 'admin.html');
            } else {
                res.statusCode = 404;
                res.end('File Not Found');
                return;
            }
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Sketchic Production Hub is running at: http://localhost:${PORT}`);
});
