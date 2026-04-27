'use client';

import Link from 'next/link';
import { motion, useAnimationControls } from 'framer-motion';
import { memo, useEffect } from 'react';
import type { BoardCase } from '@/data/cases';
import { CaseStamp } from '@/components/ui/case-stamp';
import { NewspaperClipping } from '@/components/ui/newspaper-clipping';
import { StatusStamp } from '@/components/ui/status-stamp';

function CaseCardImpl({
  caseItem,
  isActive = false,
  mobile = false,
  priorityImage = false
}: {
  caseItem: BoardCase;
  isActive?: boolean;
  mobile?: boolean;
  priorityImage?: boolean;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!mobile && isActive) {
      void controls.start({
        rotate: [1.5, -1, 0],
        y: [0, -8, 0],
        transition: { duration: 0.5, ease: 'easeOut' }
      });
      return;
    }

    void controls.start({
      rotate: 0,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    });
  }, [controls, isActive, mobile]);

  const clipping = (
    <NewspaperClipping
      className={mobile ? 'mx-auto' : 'mx-0'}
      scrollable={!mobile}
      tiltDegree={mobile ? 0 : caseItem.rotation}
    >
      <header className="relative border-b-2 border-[rgba(26,20,16,0.2)] pb-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              className="ui-label text-[var(--stamp-blue)]"
              style={{ fontSize: 'var(--font-size-xs)' }}
            >
              The Portfolio Chronicle
            </p>
            <p className="mt-2 font-[var(--font-mono)] text-[var(--font-size-xs)] uppercase tracking-[0.1em] text-[var(--ink-dark)]">
              {caseItem.dateline}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <CaseStamp caseNumber={caseItem.caseNumber} />
            <StatusStamp status={caseItem.status} tone={caseItem.status === 'ACTIVE' ? 'blue' : 'red'} />
          </div>
        </div>

        <h2 className="max-w-[14ch] font-[var(--font-headline)] text-[var(--font-size-2xl)] italic leading-[1.05] text-[var(--ink-black)] md:text-[2.5rem]">
          {caseItem.headline}
        </h2>
        <p className="mt-3 max-w-[42rem] font-[var(--font-body)] text-[var(--font-size-lg)] leading-[1.5] text-[var(--ink-dark)]">
          {caseItem.subheadline}
        </p>
      </header>

      <div className="newspaper-body mt-5">
        <div className="mb-5">
          <p className="ui-label text-[var(--stamp-blue)]">Special report</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
            {caseItem.reporterNote}
          </p>
        </div>

        <div className="mb-5 overflow-hidden border border-[rgba(26,20,16,0.16)] bg-[var(--paper-aged)]">
          <img
            alt={caseItem.imageAlt}
            className="aspect-[4/3] w-full object-cover"
            decoding="async"
            fetchPriority={priorityImage ? 'high' : 'auto'}
            height="600"
            loading={priorityImage ? 'eager' : 'lazy'}
            src={caseItem.mockupImage}
            width="800"
          />
        </div>

        <div className="mb-5">
          <p className="text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{caseItem.description}</p>
        </div>

        <div className="mb-5">
          <p className="ui-label text-[var(--stamp-blue)]">Filed findings</p>
          <ul className="mt-3 space-y-2 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">
            {caseItem.evidenceBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-5 border-t-2 border-[rgba(26,20,16,0.2)] pt-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {caseItem.techStack.map((tech) => (
            <span className="case-pill" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="paper-link" href={`/work/${caseItem.slug}/`}>
            View Project
          </Link>
          {caseItem.projectUrl ? (
            <a className="paper-link paper-link--secondary" href={caseItem.projectUrl} rel="noreferrer" target="_blank">
              Live Link
            </a>
          ) : null}
          {caseItem.githubUrl ? (
            <a className="paper-link paper-link--secondary" href={caseItem.githubUrl} rel="noreferrer" target="_blank">
              GitHub
            </a>
          ) : null}
        </div>
      </footer>
    </NewspaperClipping>
  );

  if (mobile) {
    return <div className="relative">{clipping}</div>;
  }

  return (
    <motion.div
      animate={controls}
      className="w-[clamp(320px,60vw,860px)]"
      initial={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {clipping}
    </motion.div>
  );
}

export const CaseCard = memo(CaseCardImpl);
