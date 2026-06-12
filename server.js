const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
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

const server = http.createServer((req, res) => {
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
                    
                    // Attempt Git commit and push automatically
                    const gitCmd = 'git add public_assets.json index.html portal.js style.css logo.jpg && git commit -m "Auto-update public assets" && git push';
                    exec(gitCmd, { cwd: PUBLIC_DIR }, (gitErr, stdout, stderr) => {
                        if (gitErr) {
                            console.error('Git auto-push failed:', gitErr, stderr);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                success: true, 
                                pushed: false, 
                                error: 'تعذر التحديث التلقائي في GitHub. تأكد من إعداد مستودع Git محلياً، وربطه بالـ Remote، وحفظ بيانات اعتماد GitHub الخاصة بك.' 
                            }));
                            return;
                        }
                        console.log('Git auto-push succeeded:', stdout);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, pushed: true }));
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
