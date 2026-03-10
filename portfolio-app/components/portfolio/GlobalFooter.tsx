'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalFooter() {
  const pathname = usePathname();

  return (
    <footer className="global-footer">
      <nav className="global-footer__nav" aria-label="Global navigation">
        <a href="/" className="global-footer__link">Links</a>
        <a href="/resume/" className="global-footer__link">Resume</a>
        <Link
          href="/portfolio/"
          className="global-footer__link"
          aria-current={pathname?.startsWith('/portfolio') ? 'page' : undefined}
          prefetch={false}
        >
          Portfolio
        </Link>
      </nav>

      <div className="global-footer__contacts">
        <a href="mailto:contact@dictuzz.me" className="global-footer__contact-link" aria-label="Email Me">
          <i className="fas fa-envelope"></i> contact@dictuzz.me
        </a>
        <span className="global-footer__divider">&bull;</span>
        <a href="https://linkedin.com/in/dictuzz" className="global-footer__contact-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin"></i> LinkedIn
        </a>
        <span className="global-footer__divider">&bull;</span>
        <a href="/terms/" className="global-footer__contact-link">
          <i className="fas fa-file-contract"></i> Terms
        </a>
      </div>

      <p className="global-footer__copy">
        &copy; 2026 Benedictus Richard Ricardo. All rights reserved.
        <span>Quam Plurimi et Quam Aptissimi.</span>
      </p>
    </footer>
  );
}
