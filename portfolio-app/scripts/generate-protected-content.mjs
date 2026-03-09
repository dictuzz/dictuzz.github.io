import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import tsModule from 'typescript';

const ts = tsModule.default ?? tsModule;
const appRoot = resolve(import.meta.dirname, '..');
const outputRoot = resolve(appRoot, 'public', 'protected');
const accessCode = process.env.PORTFOLIO_ACCESS_CODE;
const iterations = 350000;
const salt = randomBytes(16);

async function loadTsModule(relativePath) {
  const absolutePath = resolve(appRoot, relativePath);
  const source = readFileSync(absolutePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler
    }
  });

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

function encryptPayload(payload) {
  const iv = randomBytes(12);
  const key = pbkdf2Sync(accessCode, salt, iterations, 32, 'sha512');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);

  return {
    v: 1,
    alg: 'A256GCM',
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-512',
      iterations,
      salt: salt.toString('base64')
    },
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64')
  };
}

function writeEncryptedFile(filename, payload) {
  writeFileSync(resolve(outputRoot, filename), `${JSON.stringify(encryptPayload(payload), null, 2)}\n`);
}

async function main() {
  if (!accessCode) {
    if (existsSync(resolve(outputRoot, 'auth.json'))) {
      console.log('Skipping protected payload generation because PORTFOLIO_ACCESS_CODE is not set.');
      return;
    }

    throw new Error('PORTFOLIO_ACCESS_CODE is required to generate protected payloads.');
  }

  const [{ homeContent }, { caseStudies }, { insights }] = await Promise.all([
    loadTsModule('content/home.ts'),
    loadTsModule('content/case-studies.ts'),
    loadTsModule('content/insights.ts')
  ]);

  rmSync(outputRoot, { recursive: true, force: true });
  mkdirSync(outputRoot, { recursive: true });

  writeEncryptedFile('auth.json', {
    kind: 'auth',
    marker: 'dictuzz-portfolio-private-v1'
  });

  writeEncryptedFile('home.json', {
    kind: 'home',
    home: homeContent,
    caseStudies,
    insights
  });

  for (const caseStudy of caseStudies) {
    writeEncryptedFile(`work--${caseStudy.slug}.json`, {
      kind: 'work',
      caseStudy,
      related: caseStudies.filter((entry) => entry.slug !== caseStudy.slug).slice(0, 2)
    });
  }

  for (const insight of insights) {
    writeEncryptedFile(`thinking--${insight.slug}.json`, {
      kind: 'thinking',
      insight
    });
  }

  for (const caseStudy of caseStudies) {
    for (const alias of caseStudy.aliases ?? []) {
      writeEncryptedFile(`legacy--${alias}.json`, {
        kind: 'legacy',
        legacySlug: alias,
        target: {
          slug: caseStudy.slug,
          title: caseStudy.title,
          category: caseStudy.category
        }
      });
    }
  }

  console.log(`Generated protected payloads in ${outputRoot}`);
}

await main();
