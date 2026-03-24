import type { CaseStudy } from '@/content/types';
import { getPortfolioCaseStudies } from '@/lib/content';

export interface Case {
  id: string;
  slug: string;
  caseNumber: string;
  status: 'SOLVED' | 'ACTIVE' | 'CLASSIFIED';
  headline: string;
  subheadline: string;
  reporterNote: string;
  description: string;
  techStack: string[];
  mockupImage: string;
  projectUrl?: string;
  githubUrl?: string;
  dateline: string;
  tiltDegree: number;
  boardX: number;
  boardY: number;
  rotation: number;
}

const BOARD_POSITIONS = [
  { boardX: 1120, boardY: 360, rotation: -2.2 },
  { boardX: 2050, boardY: 1260, rotation: 1.6 },
  { boardX: 3040, boardY: 320, rotation: -1.1 },
  { boardX: 3970, boardY: 1340, rotation: 2.1 }
] as const;

function normalizeStatus(status: string): Case['status'] {
  if (status === 'ACTIVE') return 'ACTIVE';
  if (status === 'CLASSIFIED') return 'CLASSIFIED';
  return 'SOLVED';
}

function toDateline(caseStudy: CaseStudy) {
  if (caseStudy.dateline) {
    return caseStudy.dateline;
  }

  const yearMatch = caseStudy.timeline.match(/\b(20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : '2026';
  const city = caseStudy.location.split(',')[0]?.trim() || caseStudy.organization;

  return `${city.toUpperCase()}, ${year}`;
}

function toReporterNote(caseStudy: CaseStudy) {
  const firstImpact = caseStudy.impact[0];
  const result = firstImpact ? `${firstImpact.value} ${firstImpact.label}` : 'a measurable operating result';

  return `IN A METHODICAL MOVE that prioritized structure over spectacle, ${caseStudy.organization} saw ${result} after ${caseStudy.title.toLowerCase()} introduced a cleaner operating rhythm. The case now stands as documentary proof that disciplined systems work can change how teams move.`;
}

export function toPortfolioBoardCard(caseStudy: CaseStudy, index: number): Case {
  const boardPlacement = BOARD_POSITIONS[index] ?? {
    boardX: 220 + index * 680,
    boardY: 320 + ((index % 3) - 1) * 240,
    rotation: caseStudy.board.rotation
  };

  return {
    id: `case-${String(index + 1).padStart(3, '0')}`,
    slug: caseStudy.slug,
    caseNumber: caseStudy.board.recordCode.replace('VOL. I / ', ''),
    status: normalizeStatus(caseStudy.board.status),
    headline: caseStudy.title.toUpperCase(),
    subheadline: caseStudy.headline,
    reporterNote: toReporterNote(caseStudy),
    description: `${caseStudy.summary} ${caseStudy.outcome}`,
    techStack: caseStudy.tools,
    mockupImage: caseStudy.image.src,
    projectUrl: caseStudy.projectUrl,
    githubUrl: caseStudy.githubUrl,
    dateline: toDateline(caseStudy),
    tiltDegree: boardPlacement.rotation,
    boardX: boardPlacement.boardX,
    boardY: boardPlacement.boardY,
    rotation: boardPlacement.rotation
  };
}

export function getCases(): Case[] {
  return getPortfolioCaseStudies().map(toPortfolioBoardCard);
}

export const cases = getCases();
