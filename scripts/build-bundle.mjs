import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePaths = [
  path.join(repositoryRoot, 'assests/js/motion-engine.js'),
  path.join(repositoryRoot, 'assests/js/script.js')
];
const outputPath = path.join(repositoryRoot, 'assests/js/app.bundle.js');
const sources = await Promise.all(sourcePaths.map(async (sourcePath) => (await readFile(sourcePath, 'utf8')).trimEnd()));

await writeFile(outputPath, `${sources.join('\n\n')}\n`, 'utf8');
console.log('Built assests/js/app.bundle.js from the pinned motion engine and portfolio script.');
