import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Access',
  description: 'Secure portfolio login for dictuzz.'
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next || '/portfolio/';

  return (
    <main className="page-wrapper min-h-screen">
      <div className="fixed inset-0">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: 'var(--board-bg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-55"
            style={{
              backgroundImage: `
                radial-gradient(circle at 18% 14%, rgba(255,255,255,0.025), transparent 18%),
                radial-gradient(circle at 78% 22%, rgba(255,255,255,0.02), transparent 20%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)
              `
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <section className="newspaper-card scrollbar-paper relative w-full max-w-2xl overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute right-6 top-6 hidden sm:block">
            <span className="status-stamp">Restricted</span>
          </div>

          <div className="flex flex-col gap-6">
            <header className="space-y-4 border-b border-[rgba(26,20,16,0.18)] pb-6">
              <p className="chalk-label !text-[var(--ink-dark)]">Portfolio Archive</p>
              <h1 className="max-w-xl text-4xl italic text-[var(--ink-black)] sm:text-5xl">
                Access Required For The Detective Board
              </h1>
              <p className="max-w-xl text-base text-[var(--ink-dark)] sm:text-lg">
                Enter the archive key to continue into the protected case board and full dossier pages.
              </p>
            </header>

            <form action="/portfolio/api/portfolio-auth" className="space-y-5" method="post">
              <input name="next" type="hidden" value={next} />

              <label className="flex flex-col gap-2">
                <span className="chalk-label !text-[var(--ink-dark)]">Archive Key</span>
                <input
                  autoComplete="current-password"
                  className="min-h-13 w-full border border-[rgba(26,20,16,0.28)] bg-[rgba(255,252,246,0.82)] px-4 py-3 font-[var(--font-mono)] text-sm tracking-[0.14em] text-[var(--ink-black)] outline-none transition focus:border-[var(--stamp-blue)]"
                  name="passphrase"
                  placeholder="Enter access key"
                  type="password"
                />
              </label>

              <p className="min-h-6 text-sm text-[var(--ink-dark)]">
                If the password does not work, use the contact route below.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="paper-link">
                  Unlock Portfolio
                </button>
                <a className="paper-link paper-link--secondary" href="/">
                  Return to Base
                </a>
                <a className="paper-link paper-link--secondary" href="/resume/#connect">
                  Contact Benedictus
                </a>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
