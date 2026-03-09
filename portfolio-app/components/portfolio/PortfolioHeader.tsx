'use client';

import Link from 'next/link';

export function PortfolioHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brandmark" href="/" prefetch={false}>
          <span className="brandmark__dot" />
          <span className="brandmark__copy">
            <strong>Benedictus Richard Ricardo</strong>
            <small>Portfolio</small>
          </span>
        </Link>
        <nav className="top-nav" aria-label="Portfolio sections">
          <Link href="/#selected-work" prefetch={false}>
            Work
          </Link>
          <Link href="/#trust" prefetch={false}>
            Trust
          </Link>
          <Link href="/#process" prefetch={false}>
            Process
          </Link>
          <Link href="/#thinking" prefetch={false}>
            Thinking
          </Link>
          <Link href="/#about" prefetch={false}>
            About
          </Link>
          <Link href="/#contact" prefetch={false}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
