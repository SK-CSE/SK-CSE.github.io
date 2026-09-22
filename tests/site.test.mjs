import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolveStaticRequest } from '../scripts/serve.mjs';

async function get(url, method = 'GET') {
  const result = await resolveStaticRequest({ url, method });
  return { ...result, body: result.body.toString(), headers: Object.fromEntries(Object.entries(result.headers).map(([key, value]) => [key.toLowerCase(), value])) };
}

test('homepage serves successfully with query parameters', async () => {
  const response = await get('/?source=preview');
  assert.equal(response.status, 200);
  assert.match(response.headers['content-type'], /text\/html/);
  assert.match(response.body, /Clarity in/);
});
test('styles and scripts are served with browser-compatible MIME types', async () => {
  for (const [path, mime] of [['/styles.css', 'text/css'], ['/compact.css', 'text/css'], ['/app.js', 'text/javascript'], ['/motion.js', 'text/javascript'], ['/assets/favicon.svg', 'image/svg+xml']]) {
    const response = await get(path);
    assert.equal(response.status, 200);
    assert.ok(response.headers['content-type'].startsWith(mime));
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
  }
});
test('HEAD has no response body', async () => { const response = await get('/', 'HEAD'); assert.equal(response.status, 200); assert.equal(response.body, ''); });
test('missing files return 404 instead of HTML with a success status', async () => { assert.equal((await get('/missing.js')).status, 404); });
test('non-read methods are rejected', async () => { const response = await get('/', 'POST'); assert.equal(response.status, 405); assert.equal(response.headers.allow, 'GET, HEAD'); });
test('hidden files, encoded traversal, and malformed URLs are rejected', async () => {
  for (const path of ['/.git/config', '/assets/%2e%2e%2f.git/config', '/%5c.git/config']) assert.equal((await get(path)).status, 403, path);
  assert.equal((await get('/%ZZ')).status, 400);
});
test('all local references and anchor targets exist', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
  for (const [, target] of html.matchAll(/href="#([^"]*)"/g)) assert.ok(ids.includes(target), `Missing anchor: ${target}`);
  for (const [, path] of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) await access(new URL(`../${path}`, import.meta.url));
});
test('page has one main heading, named dialogs, and safe external links', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<dialog[^>]+aria-labelledby="case-title"/);
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(tag, /rel="noopener noreferrer"/);
});
