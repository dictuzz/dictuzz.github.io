import assert from 'node:assert';
import { test } from 'node:test';
import { getPortfolioCaseStudies } from '@/lib/content';
import { getCases, toPortfolioBoardCard } from './cases';

test('toCase maps canonical case studies into board cases', () => {
  const caseStudies = getPortfolioCaseStudies();
  const mapped = toPortfolioBoardCard(caseStudies[0], 0);

  assert.strictEqual(mapped.id, 'case-001');
  assert.strictEqual(mapped.slug, 'automation-mandate');
  assert.strictEqual(mapped.caseNumber, 'NO. 1');
  assert.strictEqual(mapped.status, 'CLASSIFIED');
  assert.strictEqual(mapped.headline, 'THE AUTOMATION MANDATE');
  assert.strictEqual(mapped.mockupImage, caseStudies[0].image.src);
  assert.strictEqual(mapped.boardX, 1120);
  assert.strictEqual(mapped.boardY, 360);
  assert.strictEqual(mapped.rotation, -2.2);
  assert.strictEqual(mapped.tiltDegree, mapped.rotation);
});

test('getCases preserves canonical ordering and normalizes legacy statuses', () => {
  const caseStudies = getPortfolioCaseStudies();
  const mapped = getCases();

  assert.strictEqual(mapped.length, caseStudies.length);
  assert.deepStrictEqual(
    mapped.map((entry) => entry.slug),
    caseStudies.map((entry) => entry.slug)
  );
  assert.strictEqual(mapped[1].status, 'SOLVED');
  assert.strictEqual(mapped[3].status, 'SOLVED');
});
