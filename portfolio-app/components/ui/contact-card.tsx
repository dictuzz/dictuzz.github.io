import { PortfolioHomeData } from '@/content/types';
import { NewspaperClipping } from '@/components/ui/newspaper-clipping';

export function ContactCard({ home }: { home: PortfolioHomeData }) {
  return (
    <NewspaperClipping className="mx-0" scrollable={false} tiltDegree={1.3}>
      <header className="border-b-2 border-[rgba(26,20,16,0.2)] pb-4">
        <p className="ui-label text-[var(--stamp-blue)]">Dispatch Contact</p>
        <h2 className="mt-4 max-w-[14ch] font-[var(--font-headline)] text-[var(--font-size-2xl)] italic leading-[1.02] text-[var(--ink-black)]">
          {home.contact.title}
        </h2>
        <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.contact.body}</p>
      </header>

      <div className="mt-5 grid gap-3">
        <a className="paper-link" href={`mailto:${home.contact.email}`}>
          Email Dispatch
        </a>
        <a className="paper-link paper-link--secondary" href={home.contact.linkedin} rel="noreferrer" target="_blank">
          LinkedIn File
        </a>
        <a className="paper-link paper-link--secondary" href={home.contact.calendar} rel="noreferrer" target="_blank">
          Book Calendar
        </a>
      </div>

      <footer className="mt-5 border-t-2 border-[rgba(26,20,16,0.2)] pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="case-pill">{home.contact.email}</span>
          <span className="case-pill">{home.contact.availability}</span>
        </div>
      </footer>
    </NewspaperClipping>
  );
}
