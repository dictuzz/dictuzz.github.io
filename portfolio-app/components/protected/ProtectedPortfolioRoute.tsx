'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type {
  ProtectedHomePayload,
  ProtectedInsightPayload,
  ProtectedLegacyPayload,
  ProtectedPayload,
  ProtectedWorkPayload
} from '@/content/types';
import {
  getProtectedAssetPath,
  getProtectedRoutePath,
  type ProtectedRouteDescriptor,
  protectedAssetBasePath
} from '@/lib/protected-route';

const HomePage = dynamic(() => import('@/components/portfolio/HomePage').then((module) => module.HomePage), {
  ssr: false
});

const PortfolioHeader = dynamic(
  () => import('@/components/portfolio/PortfolioHeader').then((module) => module.PortfolioHeader),
  {
    ssr: false
  }
);

const CaseStudyPage = dynamic(
  () => import('@/components/case-study/CaseStudyPage').then((module) => module.CaseStudyPage),
  {
    ssr: false
  }
);

const InsightPage = dynamic(() => import('@/components/thinking/InsightPage').then((module) => module.InsightPage), {
  ssr: false
});

type EncryptedEnvelope = {
  v: number;
  alg: string;
  kdf: {
    name: string;
    hash: string;
    iterations: number;
    salt: string;
  };
  iv: string;
  ciphertext: string;
};

type AuthPayload = {
  kind: 'auth';
  marker: string;
};

const authPath = `${protectedAssetBasePath}/auth.json`;
const authMarker = 'dictuzz-portfolio-private-v1';
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

let inMemoryAccessCode = '';
let cachedCode = '';
let cachedSalt = '';
let cachedIterations = 0;
let cachedHash = '';
let cachedKeyPromise: Promise<CryptoKey> | null = null;

function decodeBase64(base64: string) {
  const binary = window.atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function fetchEnvelope(path: string) {
  const response = await fetch(path, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Unable to load protected payload: ${response.status}`);
  }

  return (await response.json()) as EncryptedEnvelope;
}

async function deriveKey(code: string, envelope: EncryptedEnvelope) {
  const {
    iterations,
    hash,
    salt
  } = envelope.kdf;

  if (
    cachedKeyPromise &&
    cachedCode === code &&
    cachedSalt === salt &&
    cachedIterations === iterations &&
    cachedHash === hash
  ) {
    return cachedKeyPromise;
  }

  cachedCode = code;
  cachedSalt = salt;
  cachedIterations = iterations;
  cachedHash = hash;
  cachedKeyPromise = crypto.subtle
    .importKey('raw', textEncoder.encode(code), 'PBKDF2', false, ['deriveKey'])
    .then((material) =>
      crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          hash,
          salt: decodeBase64(salt),
          iterations
        },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      )
    );

  return cachedKeyPromise;
}

async function decryptEnvelope<T>(envelope: EncryptedEnvelope, code: string) {
  const key = await deriveKey(code, envelope);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: decodeBase64(envelope.iv),
      tagLength: 128
    },
    key,
    decodeBase64(envelope.ciphertext)
  );

  return JSON.parse(textDecoder.decode(decrypted)) as T;
}

async function verifyAccessCode(code: string) {
  const envelope = await fetchEnvelope(authPath);
  const payload = await decryptEnvelope<AuthPayload>(envelope, code);

  if (payload.marker !== authMarker) {
    throw new Error('Invalid access code');
  }
}

async function loadRoutePayload(route: ProtectedRouteDescriptor, code: string) {
  const envelope = await fetchEnvelope(getProtectedAssetPath(route));
  return decryptEnvelope<ProtectedPayload>(envelope, code);
}

function LegacyAliasView({ payload }: { payload: ProtectedLegacyPayload }) {
  return (
    <>
      <PortfolioHeader />
      <main className="page-main">
        <section className="alias-shell">
          <p className="eyebrow">Archive Path</p>
          <h1 className="page-title">This archive link now points to the current private case study.</h1>
          <p className="page-intro">
            The old link is still supported for compatibility, but the latest version of the work now lives inside the
            private portfolio system.
          </p>
          <div className="alias-card">
            <div>
              <p className="detail-label">Legacy path</p>
              <p className="detail-value">/portfolio/{payload.legacySlug}/</p>
            </div>
            <div>
              <p className="detail-label">Current case study</p>
              <p className="detail-value">{payload.target.title}</p>
            </div>
            <div>
              <p className="detail-label">Category</p>
              <p className="detail-value">{payload.target.category}</p>
            </div>
          </div>
          <div className="button-row">
            <Link className="button button--primary" href={`/work/${payload.target.slug}`} prefetch={false}>
              Open Current Case Study
            </Link>
            <Link className="button button--secondary" href="/" prefetch={false}>
              Back to Portfolio
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function AccessLockedScreen({
  code,
  error,
  isLoading,
  onCodeChange,
  onSubmit
}: {
  code: string;
  error: string;
  isLoading: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <main className="page-main access-lock">
      <section className="access-lock__panel" aria-labelledby="portfolio-access-title">
        <p className="eyebrow">Private Portfolio</p>
        <h1 className="page-title access-lock__title" id="portfolio-access-title">
          Access code required.
        </h1>
        <p className="page-intro access-lock__intro">
          This portfolio is shared privately. Enter the access code to decrypt and view the work.
        </p>
        <form className="access-lock__form" onSubmit={onSubmit}>
          <label className="access-lock__label" htmlFor="portfolio-access-code">
            Access Code
          </label>
          <input
            autoComplete="current-password"
            className="access-lock__input"
            id="portfolio-access-code"
            name="portfolio-access-code"
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Enter access code"
            spellCheck="false"
            type="password"
            value={code}
          />
          {error ? <p className="access-lock__error">{error}</p> : null}
          <button className="button button--primary access-lock__submit" disabled={isLoading} type="submit">
            {isLoading ? 'Unlocking...' : 'Unlock Portfolio'}
          </button>

          <div className="flex flex--center mt-12">
            <a
              href="mailto:contact@dictuzz.me?subject=Portfolio%20Access%20Request"
              className="text-sm text-muted hover-text-primary underline-offset"
              style={{ fontSize: '0.9rem', color: 'var(--color-text-soft)', textDecoration: 'underline', marginTop: '16px', display: 'inline-block' }}
            >
              Need access? Request a code
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}

export function ProtectedPortfolioRoute({ route }: { route: ProtectedRouteDescriptor }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<ProtectedPayload | null>(null);
  const currentPath = useMemo(() => getProtectedRoutePath(route), [route]);

  useEffect(() => {
    let isActive = true;

    async function tryUnlockFromMemory() {
      const storedCode = inMemoryAccessCode;

      if (!storedCode) {
        if (isActive) {
          setIsLoading(false);
          setPayload(null);
        }
        return;
      }

      if (isActive) {
        setIsLoading(true);
      }

      try {
        const nextPayload = await loadRoutePayload(route, storedCode);

        if (!isActive) {
          return;
        }

        setCode(storedCode);
        setPayload(nextPayload);
        setError('');
      } catch {
        inMemoryAccessCode = '';

        if (isActive) {
          setPayload(null);
          setError('');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    setPayload(null);
    tryUnlockFromMemory();

    return () => {
      isActive = false;
    };
  }, [route]);

  async function unlockPortfolio(nextCode: string) {
    setIsLoading(true);
    setError('');

    try {
      await verifyAccessCode(nextCode);
      const nextPayload = await loadRoutePayload(route, nextCode);
      inMemoryAccessCode = nextCode;
      setPayload(nextPayload);
      setCode(nextCode);
    } catch {
      inMemoryAccessCode = '';
      setPayload(null);
      setError('The access code is incorrect.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextCode = code.trim();

    if (!nextCode) {
      setError('Enter the access code to continue.');
      return;
    }

    await unlockPortfolio(nextCode);
  }

  if (!payload) {
    return (
      <AccessLockedScreen
        code={code}
        error={error}
        isLoading={isLoading}
        onCodeChange={setCode}
        onSubmit={handleSubmit}
      />
    );
  }

  switch (payload.kind) {
    case 'home':
      return (
        <div data-protected-path={currentPath}>
          <HomePage
            home={(payload as ProtectedHomePayload).home}
            caseStudies={(payload as ProtectedHomePayload).caseStudies}
            insights={(payload as ProtectedHomePayload).insights}
          />
        </div>
      );
    case 'work':
      return (
        <div data-protected-path={currentPath}>
          <CaseStudyPage
            caseStudy={(payload as ProtectedWorkPayload).caseStudy}
            related={(payload as ProtectedWorkPayload).related}
          />
        </div>
      );
    case 'thinking':
      return (
        <div data-protected-path={currentPath}>
          <InsightPage insight={(payload as ProtectedInsightPayload).insight} />
        </div>
      );
    case 'legacy':
      return (
        <div data-protected-path={currentPath}>
          <LegacyAliasView payload={payload as ProtectedLegacyPayload} />
        </div>
      );
  }
}
