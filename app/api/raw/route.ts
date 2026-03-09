import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const rawPath = path.join(process.cwd(), 'data', 'raw.json');
  const rawText = await readFile(rawPath, 'utf8');

  return new Response(rawText, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
