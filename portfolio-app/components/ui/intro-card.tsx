import { PortfolioHomeData } from '@/content/types';
import { NewspaperClipping } from '@/components/ui/newspaper-clipping';

export function IntroCard({ home }: { home: PortfolioHomeData }) {
  return (
    <NewspaperClipping className="mx-0" scrollable={false} tiltDegree={-1.6}>
      <header className="border-b-2 border-[rgba(26,20,16,0.2)] pb-4">
        <p className="ui-label text-[var(--stamp-blue)]">{home.masthead.archiveLabel}</p>
        <h2 className="mt-4 max-w-[12ch] font-[var(--font-headline)] text-[var(--font-size-3xl)] italic leading-[0.96] text-[var(--ink-black)]">
          {home.hero.name}
        </h2>
        <p className="mt-3 font-[var(--font-ui)] text-[var(--font-size-sm)] uppercase tracking-[0.1em] text-[var(--ink-dark)]">
          {home.hero.designation}
        </p>
      </header>

      <div className="newspaper-body mt-5">
        <div className="mb-5">
          <p className="ui-label text-[var(--stamp-blue)]">Opening brief</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.hero.lead}</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.hero.body}</p>
        </div>

        <div className="mb-5">
          <p className="ui-label text-[var(--stamp-blue)]">Profile note</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.profile.summary}</p>
          <blockquote className="mt-4 border-l-2 border-[var(--stamp-blue)] pl-4 font-[var(--font-headline)] text-[var(--font-size-lg)] italic leading-8 text-[var(--ink-black)]">
            {home.profile.philosophy}
          </blockquote>
        </div>
      </div>

      <footer className="mt-5 border-t-2 border-[rgba(26,20,16,0.2)] pt-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {home.hero.quickFacts.map((fact) => (
            <span className="case-pill" key={fact.label}>
              {fact.label}: {fact.value}
            </span>
          ))}
        </div>
        <p className="text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.masthead.guidance}</p>
      </footer>
    </NewspaperClipping>
  );
}
