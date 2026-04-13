import Link from 'next/link';
import type { CaseStudy } from '@/content/types';
import { toBoardCases } from '@/data/cases';
import { getPortfolioCaseStudies } from '@/lib/content';
import { ChalkboardBackground } from '@/components/ui/chalkboard-bg';
import { CaseStamp } from '@/components/ui/case-stamp';
import { NewspaperClipping } from '@/components/ui/newspaper-clipping';
import { StatusStamp } from '@/components/ui/status-stamp';

function resolveCaseShape(caseStudy: CaseStudy) {
  return toBoardCases(getPortfolioCaseStudies()).find((entry) => entry.slug === caseStudy.slug);
}

export function CaseFilePage({
  caseStudy,
  related
}: {
  caseStudy: CaseStudy;
  related: CaseStudy[];
}) {
  const caseItem = resolveCaseShape(caseStudy);

  return (
    <main className="page-wrapper relative min-h-screen overflow-hidden py-8 md:py-12">
      <ChalkboardBackground />

      <div className="board-container relative z-20 mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link className="paper-link paper-link--chalk" href="/">
            Return to evidence wall
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {caseItem ? <CaseStamp caseNumber={caseItem.caseNumber} /> : null}
            <StatusStamp
              status={caseItem?.status ?? caseStudy.board.status}
              tone={(caseItem?.status ?? caseStudy.board.status) === 'ACTIVE' ? 'blue' : 'red'}
            />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <NewspaperClipping className="mx-0 max-w-none" scrollable={false} tiltDegree={0.4}>
            <header className="border-b-2 border-[rgba(26,20,16,0.2)] pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="ui-label text-[var(--stamp-blue)]">The Portfolio Chronicle</p>
                  <p className="mt-2 font-[var(--font-mono)] text-[var(--font-size-xs)] uppercase tracking-[0.1em] text-[var(--ink-dark)]">
                    {caseItem?.dateline ?? caseStudy.dateline ?? caseStudy.timeline}
                  </p>
                </div>
                <p className="font-[var(--font-mono)] text-[var(--font-size-xs)] uppercase tracking-[0.1em] text-[var(--ink-dark)]">
                  {caseStudy.category}
                </p>
              </div>

              <h1 className="mt-5 max-w-[14ch] font-[var(--font-headline)] text-[var(--font-size-3xl)] italic leading-[0.96] text-[var(--ink-black)] md:text-[4rem]">
                {caseStudy.title}
              </h1>
              <p className="mt-4 max-w-4xl font-[var(--font-body)] text-[var(--font-size-lg)] leading-[1.6] text-[var(--ink-dark)]">
                {caseStudy.headline}
              </p>
            </header>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="space-y-6">
                <section className="newspaper-body">
                  <div className="mb-5">
                    <p className="ui-label text-[var(--stamp-blue)]">Lead report</p>
                    <p className="mt-3 text-[var(--font-size-base)] leading-8 text-[var(--ink-dark)]">
                      {caseStudy.summary}
                    </p>
                  </div>
                  <div className="mb-5">
                    <p className="ui-label text-[var(--stamp-blue)]">Challenge</p>
                    <p className="mt-3 text-[var(--font-size-base)] leading-8 text-[var(--ink-dark)]">
                      {caseStudy.problem}
                    </p>
                  </div>
                  <div className="mb-5">
                    <p className="ui-label text-[var(--stamp-blue)]">Intervention</p>
                    <p className="mt-3 text-[var(--font-size-base)] leading-8 text-[var(--ink-dark)]">
                      {caseStudy.intervention}
                    </p>
                  </div>
                  <div className="mb-5">
                    <p className="ui-label text-[var(--stamp-blue)]">Outcome</p>
                    <p className="mt-3 text-[var(--font-size-base)] leading-8 text-[var(--ink-dark)]">
                      {caseStudy.outcome}
                    </p>
                  </div>
                </section>

                <div className="overflow-hidden border border-[rgba(26,20,16,0.16)] bg-[var(--paper-aged)] shadow-[var(--shadow-paper)]">
                  <img
                    alt={caseStudy.image.alt}
                    className="aspect-[16/10] w-full object-cover"
                    src={caseStudy.image.src}
                  />
                </div>
                <p className="font-[var(--font-body)] text-[var(--font-size-sm)] italic leading-7 text-[var(--ink-dark)]">
                  {caseStudy.image.caption}
                </p>

                <section className="border-t-2 border-[rgba(26,20,16,0.2)] pt-5">
                  <p className="ui-label text-[var(--stamp-blue)]">Field notes</p>
                  <div className="mt-4 grid gap-4">
                    {caseStudy.narrative.map((section) => (
                      <article
                        className="border border-[rgba(26,20,16,0.12)] bg-[rgba(255,255,255,0.35)] px-4 py-4"
                        key={section.title}
                      >
                        <h2 className="font-[var(--font-headline)] text-[var(--font-size-xl)] italic text-[var(--ink-black)]">
                          {section.title}
                        </h2>
                        <p className="mt-3 text-[var(--font-size-base)] leading-8 text-[var(--ink-dark)]">
                          {section.body}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="border-t-2 border-[rgba(26,20,16,0.2)] pt-5">
                  <p className="ui-label text-[var(--stamp-blue)]">Recorded findings</p>
                  <ul className="mt-4 space-y-3 text-[var(--font-size-base)] leading-8 text-[var(--ink-dark)]">
                    {caseStudy.evidenceBullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="space-y-5">
                <section className="border border-[rgba(26,20,16,0.14)] bg-[rgba(255,255,255,0.45)] px-4 py-4">
                  <p className="ui-label text-[var(--stamp-blue)]">Case file</p>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="ui-label">Organization</dt>
                      <dd className="mt-2 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
                        {caseStudy.organization}
                      </dd>
                    </div>
                    <div>
                      <dt className="ui-label">Role</dt>
                      <dd className="mt-2 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
                        {caseStudy.role}
                      </dd>
                    </div>
                    <div>
                      <dt className="ui-label">Timeline</dt>
                      <dd className="mt-2 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
                        {caseStudy.timeline}
                      </dd>
                    </div>
                    <div>
                      <dt className="ui-label">Location</dt>
                      <dd className="mt-2 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
                        {caseStudy.location}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="border border-[rgba(26,20,16,0.14)] bg-[rgba(255,255,255,0.45)] px-4 py-4">
                  <p className="ui-label text-[var(--stamp-blue)]">Impact metrics</p>
                  <div className="mt-4 space-y-3">
                    {caseStudy.impact.map((metric) => (
                      <div className="border border-[rgba(26,20,16,0.12)] bg-[rgba(255,255,255,0.4)] px-4 py-4" key={metric.label}>
                        <p className="font-[var(--font-headline)] text-[var(--font-size-2xl)] italic leading-none text-[var(--ink-black)]">
                          {metric.value}
                        </p>
                        <p className="mt-2 text-[var(--font-size-sm)] uppercase tracking-[0.08em] text-[var(--ink-dark)]">
                          {metric.label}
                        </p>
                        {metric.note ? (
                          <p className="mt-2 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
                            {metric.note}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border border-[rgba(26,20,16,0.14)] bg-[rgba(255,255,255,0.45)] px-4 py-4">
                  <p className="ui-label text-[var(--stamp-blue)]">Scope and tools</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[...caseStudy.scope, ...caseStudy.tools].map((item) => (
                      <span className="case-pill" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="border border-[rgba(26,20,16,0.14)] bg-[rgba(255,255,255,0.45)] px-4 py-4">
                  <p className="ui-label text-[var(--stamp-blue)]">External evidence</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {caseStudy.projectUrl ? (
                      <a className="paper-link" href={caseStudy.projectUrl} rel="noreferrer" target="_blank">
                        Live project
                      </a>
                    ) : null}
                    {caseStudy.githubUrl ? (
                      <a className="paper-link paper-link--secondary" href={caseStudy.githubUrl} rel="noreferrer" target="_blank">
                        Source record
                      </a>
                    ) : null}
                    {!caseStudy.projectUrl && !caseStudy.githubUrl ? (
                      <p className="text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
                        No public external links were attached to this file.
                      </p>
                    ) : null}
                  </div>
                </section>
              </aside>
            </div>
          </NewspaperClipping>

          <div className="space-y-6">
            {related.length > 0 ? (
              <NewspaperClipping className="mx-0 max-w-none" scrollable={false} tiltDegree={-0.35}>
                <p className="ui-label text-[var(--stamp-blue)]">Related files</p>
                <div className="mt-4 space-y-4">
                  {related.map((entry) => {
                    const relatedCase = resolveCaseShape(entry);

                    return (
                      <Link
                        className="block border border-[rgba(26,20,16,0.12)] bg-[rgba(255,255,255,0.4)] px-4 py-4 transition-transform duration-300 hover:-translate-y-1"
                        href={`/work/${entry.slug}/`}
                        key={entry.slug}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="ui-label text-[var(--stamp-blue)]">
                            {relatedCase?.caseNumber ?? entry.board.recordCode}
                          </p>
                          <StatusStamp
                            status={relatedCase?.status ?? entry.board.status}
                            tone={(relatedCase?.status ?? entry.board.status) === 'ACTIVE' ? 'blue' : 'red'}
                          />
                        </div>
                        <h2 className="mt-3 font-[var(--font-headline)] text-[var(--font-size-xl)] italic text-[var(--ink-black)]">
                          {entry.title}
                        </h2>
                        <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{entry.summary}</p>
                      </Link>
                    );
                  })}
                </div>
              </NewspaperClipping>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
