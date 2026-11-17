const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = __dirname;
const ENABLE_CONVERGENCE = process.env.ENABLE_CONVERGENCE === 'true';
const MAX_RANGE_CHUNK = 8 * 1024 * 1024; // 8 MiB per range response (under Cloud Run 32 MiB limit)
const STREAM_CHUNKED_THRESHOLD = 20 * 1024 * 1024;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

function isPublicFile(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (!ENABLE_CONVERGENCE && normalized.includes('The_Sketchic_Convergence')) {
    return false;
  }
  return (
    normalized === 'index.html' ||
    normalized === 'styles.css' ||
    normalized === 'app.js' ||
    normalized === 'CNAME' ||
    normalized.startsWith('assets/images/') ||
    normalized.startsWith('assets/videos/')
  );
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: https://www.google-analytics.com; media-src 'self' blob: data:; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com"
  );

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  const requestedPath = pathname === '/' ? 'index.html' : pathname.replace(/^[/\\]+/, '');
  const filePath = path.resolve(PUBLIC_DIR, requestedPath);
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath) || !isPublicFile(relativePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
    const totalSize = stats.size;
    const rangeHeader = req.headers.range;

    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace(/bytes=/, '').split(',')[0].trim().split('-');
      const startStr = parts[0];
      const endStr = parts[1];
      let start;
      let end;

      if (startStr === '' && endStr) {
        const suffixLength = parseInt(endStr, 10);
        if (Number.isNaN(suffixLength) || suffixLength <= 0) {
          res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
          res.end();
          return;
        }
        start = Math.max(0, totalSize - suffixLength);
        end = Math.min(totalSize - 1, start + MAX_RANGE_CHUNK - 1);
      } else {
        start = parseInt(startStr, 10);
        const requestedEnd = endStr ? parseInt(endStr, 10) : start + MAX_RANGE_CHUNK - 1;
        if (Number.isNaN(start) || Number.isNaN(requestedEnd) || start < 0 || start >= totalSize || start > requestedEnd) {
          res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
          res.end();
          return;
        }
        end = Math.min(requestedEnd, start + MAX_RANGE_CHUNK - 1, totalSize - 1);
      }

      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': cacheControl
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      const stream = fs.createReadStream(filePath, { start, end });
      req.on('close', () => stream.destroy());
      stream.on('error', () => {
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
      stream.pipe(res);
      return;
    }

    const headers = {
      'Accept-Ranges': 'bytes',
      'Content-Type': contentType,
      'Cache-Control': cacheControl
    };

    if (req.method === 'HEAD' || totalSize <= STREAM_CHUNKED_THRESHOLD) {
      headers['Content-Length'] = totalSize;
    }

    res.writeHead(200, headers);

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    req.on('close', () => stream.destroy());
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500);
      res.end();
    });
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Sketchic.net server listening on http://${HOST}:${PORT}`);
});
