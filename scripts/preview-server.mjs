import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 8893);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png']
]);

export function createPreviewServer(root = process.cwd()) {
  return createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const filePath = path.resolve(root, `.${relativePath}`);

    if (!filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const file = await stat(filePath);
    if (!file.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    if (error instanceof URIError) {
      response.writeHead(400).end('Bad request');
      return;
    }
    response.writeHead(404).end('Not found');
  }
  });
}

if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createPreviewServer().listen(port, '127.0.0.1', () => {
    console.log(`Portfolio preview: http://127.0.0.1:${port}`);
  });
}
