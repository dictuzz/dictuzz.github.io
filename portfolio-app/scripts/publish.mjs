import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const appRoot = resolve(import.meta.dirname, '..');
const outRoot = resolve(appRoot, 'out');
const destination = resolve(appRoot, '..', 'portfolio');

if (!existsSync(outRoot)) {
  throw new Error(`Expected export directory at ${outRoot}`);
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });

for (const entry of readdirSync(outRoot)) {
  cpSync(resolve(outRoot, entry), resolve(destination, entry), {
    recursive: true,
    force: true
  });
}

function flattenRoutePayloads(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = resolve(directory, entry.name);

    if (entry.isDirectory() && entry.name.startsWith('__next')) {
      for (const nested of readdirSync(fullPath, { withFileTypes: true })) {
        const nestedPath = resolve(fullPath, nested.name);

        if (nested.isFile()) {
          cpSync(nestedPath, resolve(directory, `${entry.name}.${nested.name}`), { force: true });
          continue;
        }

        if (nested.isDirectory()) {
          for (const payload of readdirSync(nestedPath, { withFileTypes: true })) {
            if (!payload.isFile()) continue;

            cpSync(
              resolve(nestedPath, payload.name),
              resolve(directory, `${entry.name}.${nested.name}.${payload.name}`),
              { force: true }
            );
          }
        }
      }
    }

    if (entry.isDirectory() && !entry.name.startsWith('_next')) {
      flattenRoutePayloads(fullPath);
    }
  }
}

flattenRoutePayloads(destination);
