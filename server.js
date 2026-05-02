import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file
try {
  const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  env.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
} catch {}

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const MIME = {
  '.html': 'text/html', '.css': 'text/css',
  '.js': 'application/javascript', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json', '.woff2': 'font/woff2',
};

function serveStatic(req, res) {
  // Strip query strings
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, 'public', urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath)) filePath = path.join(__dirname, 'public', 'index.html');
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/plain';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const headers = { 'Content-Type': mime };
    if (['.js','.css'].includes(ext)) headers['Cache-Control'] = 'no-store';
    res.writeHead(200, headers);
    res.end(data);
  });
}

async function handleChat(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      if (!ANTHROPIC_API_KEY) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          content: [{ type: 'text', text: 'API key not configured. Please add ANTHROPIC_API_KEY to your .env file.' }]
        }));
        return;
      }

      const { messages, system } = JSON.parse(body);

      console.log(`[AI] Request — ${messages.length} message(s)`);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: system,
          messages: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[AI] Anthropic error:', JSON.stringify(data));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          content: [{ type: 'text', text: `Error from AI: ${data.error?.message || 'Unknown error'}. Please try again.` }]
        }));
        return;
      }

      console.log(`[AI] Response OK — ${data.usage?.output_tokens || '?'} tokens`);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(data));

    } catch (e) {
      console.error('[AI] Server error:', e.message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        content: [{ type: 'text', text: 'Network error. Please check your internet connection and try again.' }]
      }));
    }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'POST' && req.url === '/api/chat') return handleChat(req, res);
  serveStatic(req, res);
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n╔══════════════════════════════════╗`);
  console.log(`║       🌱 Nivesh AI Ready!        ║`);
  console.log(`╠══════════════════════════════════╣`);
  console.log(`║  URL  : ${url.padEnd(23)} ║`);
  console.log(`║  Key  : ${(ANTHROPIC_API_KEY ? '✓ API key set' : '✗ No API key!').padEnd(23)} ║`);
  console.log(`║  Stop : Ctrl+C                   ║`);
  console.log(`╚══════════════════════════════════╝\n`);

  import('child_process').then(({ exec }) => {
    const cmd = process.platform === 'win32' ? `start ${url}`
              : process.platform === 'darwin'  ? `open ${url}`
              : `xdg-open ${url}`;
    exec(cmd);
  });
});
