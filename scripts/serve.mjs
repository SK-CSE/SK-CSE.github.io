import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };

export async function resolveStaticRequest(request, rootDirectory = fileURLToPath(new URL('../', import.meta.url))) {
  const root = resolve(rootDirectory);
  if (!['GET', 'HEAD'].includes(request.method)) {
    return { status: 405, headers: { Allow: 'GET, HEAD' }, body: 'Method not allowed' };
  }
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const segments = path.split('/');
    if (segments.some(part => part.startsWith('.') || part.includes('\\') || part.includes('\0'))) {
      return { status: 403, headers: {}, body: 'Forbidden' };
    }
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) {
      return { status: 403, headers: {}, body: 'Forbidden' };
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const content = await readFile(file);
    return { status: 200, headers: { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' }, body: request.method === 'HEAD' ? '' : content };
  } catch (error) {
    return { status: error instanceof URIError ? 400 : 404, headers: {}, body: error instanceof URIError ? 'Bad request' : 'Not found' };
  }
}

export function createStaticServer(rootDirectory) {
  return createServer(async (request, response) => {
    const result = await resolveStaticRequest(request, rootDirectory);
    response.writeHead(result.status, result.headers).end(request.method === 'HEAD' ? undefined : result.body);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const portArgument = process.argv.indexOf('--port');
  const port = Number(portArgument >= 0 ? process.argv[portArgument + 1] : process.env.PORT || 4173);
  const server = createStaticServer();
  server.on('error', error => { console.error(`Cannot start preview: ${error.code}. Try a different --port if it is already in use.`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${port}`));
}
