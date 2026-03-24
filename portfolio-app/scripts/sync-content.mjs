import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve(process.cwd(), '..');
const sourceDir = path.join(rootDir, 'content');
const targetDir = path.join(process.cwd(), 'generated-content');

async function copyDirectory(source, target) {
  await fs.mkdir(target, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
      return;
    }

    await fs.copyFile(sourcePath, targetPath);
  }));
}

await copyDirectory(sourceDir, targetDir);
