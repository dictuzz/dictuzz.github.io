import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const cliDirectory = path.dirname(require.resolve('@axe-core/cli/package.json'));
const cliPath = path.join(cliDirectory, 'dist', 'src', 'bin', 'cli.js');
const chromedriverPath = require('chromedriver').path;
mkdirSync('results', { recursive: true });

const result = spawnSync(process.execPath, [
  cliPath,
  'http://localhost:8000',
  '--tags',
  'wcag2aa,wcag21aa',
  '--save',
  'results/axe-report.json',
  '--exit',
  '--chromedriver-path',
  chromedriverPath
], { stdio: 'inherit' });

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
