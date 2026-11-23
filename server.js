const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = __dirname;
const CANON_DB_PATH = path.join(PUBLIC_DIR, 'data', 'canon-db.json');
const ENABLE_CONVERGENCE = process.env.ENABLE_CONVERGENCE === 'true';
const MAX_RANGE_CHUNK = 8 * 1024 * 1024; // 8 MiB per range response (under Cloud Run 32 MiB limit)
const STREAM_CHUNKED_THRESHOLD = 20 * 1024 * 1024;

function loadCanonDb(enableConvergence) {
  const raw = fs.readFileSync(CANON_DB_PATH, 'utf8');
  const db = JSON.parse(raw);
  db.meta = db.meta || {};
  db.meta.showConvergence = Boolean(enableConvergence);

  if (!enableConvergence) {
    db.worlds = (db.worlds || []).filter((w) => w.isPublic !== false);
    db.characters = (db.characters || []).filter((c) => c.isPublic !== false);
    db.ingredients = (db.ingredients || []).filter((i) => i.isPublic !== false);
    db.comics = (db.comics || []).filter((c) => c.isPublic !== false);

    const visibleWorldIds = new Set(db.worlds.map((w) => w.id));
    const visibleCharIds = new Set(db.characters.map((c) => c.id));
    const visibleIngIds = new Set(db.ingredients.map((i) => i.id));

    db.voiceBindings = (db.voiceBindings || []).filter(
      (vb) => visibleWorldIds.has(vb.worldId) && visibleCharIds.has(vb.characterId)
    );
    db.worldAppearances = (db.worldAppearances || []).filter((wa) => {
      if (!visibleWorldIds.has(wa.worldId)) return false;
      return wa.entityType === 'character'
        ? visibleCharIds.has(wa.entityId)
        : visibleIngIds.has(wa.entityId);
    });
  }

  return db;
}

function sendDynamicPayload(req, res, body, contentType) {
  const byteLength = Buffer.byteLength(body, 'utf8');
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': byteLength,
    'Cache-Control': 'no-cache'
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  res.end(body, 'utf8');
}

function handleCanonRoute(req, res, pathname) {
  const routes = new Set([
    '/api/canon',
    '/api/canon/worlds',
    '/api/canon/characters',
    '/api/canon/voices',
    '/api/canon/ingredients',
    '/api/canon/comics',
    '/api/canon/laws',
    '/data/canon-db.json',
    '/data/canon-db.js'
  ]);
  if (!routes.has(pathname)) return false;

  let db;
  try {
    db = loadCanonDb(ENABLE_CONVERGENCE);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Failed to load Sketchic Canon DB' }));
    return true;
  }

  if (pathname === '/data/canon-db.js') {
    const jsPayload = `window.SKETCHIC_CANON_DB = ${JSON.stringify(db)};\n`;
    sendDynamicPayload(req, res, jsPayload, 'application/javascript; charset=utf-8');
    return true;
  }

  let payload = db;
  if (pathname === '/api/canon/worlds') {
    payload = { meta: db.meta, worlds: db.worlds };
  } else if (pathname === '/api/canon/characters') {
    payload = { meta: db.meta, characters: db.characters };
  } else if (pathname === '/api/canon/voices') {
    payload = { meta: db.meta, voices: db.voices, voiceBindings: db.voiceBindings };
  } else if (pathname === '/api/canon/ingredients') {
    payload = { meta: db.meta, ingredients: db.ingredients };
  } else if (pathname === '/api/canon/comics') {
    payload = { meta: db.meta, comics: db.comics };
  } else if (pathname === '/api/canon/laws') {
    payload = { meta: db.meta, cosmicLaws: db.cosmicLaws };
  }

  sendDynamicPayload(req, res, JSON.stringify(payload), 'application/json; charset=utf-8');
  return true;
}

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
  '.vtt': 'text/vtt; charset=utf-8',
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
    normalized === 'play/index.html' ||
    normalized === 'play/game.css' ||
    normalized === 'play/game.js' ||
    normalized === 'flow-studio/index.html' ||
    normalized.startsWith('assets/images/') ||
    normalized.startsWith('assets/videos/') ||
    normalized.startsWith('assets/subtitles/')
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

  if (handleCanonRoute(req, res, pathname)) {
    return;
  }

  const requestedPath =
    pathname === '/'
      ? 'index.html'
      : pathname === '/play' || pathname === '/play/'
      ? 'play/index.html'
      : pathname === '/flow-studio' || pathname === '/flow-studio/'
      ? 'flow-studio/index.html'
      : pathname.replace(/^[/\\]+/, '');
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
