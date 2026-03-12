import test from 'node:test';
import assert from 'node:assert';
import { caseStudies } from '@/content/case-studies';
import { getCaseStudies, getCaseStudy, getRelatedCaseStudies } from './content';

test('getCaseStudies', () => {
  const result = getCaseStudies();
  assert.strictEqual(result, caseStudies, 'Should return the exact caseStudies array');
  assert.ok(Array.isArray(result), 'Should return an array');
  assert.ok(result.length > 0, 'Should return an array with elements');
});

test('getCaseStudy', async (t) => {
  await t.test('returns the correct case study for a valid slug', () => {
    const validSlug = caseStudies[0].slug;
    const result = getCaseStudy(validSlug);
    assert.strictEqual(result, caseStudies[0], 'Should return the case study matching the slug');
  });

  await t.test('returns undefined for an invalid slug', () => {
    const invalidSlug = 'non-existent-case-study-slug';
    const result = getCaseStudy(invalidSlug);
    assert.strictEqual(result, undefined, 'Should return undefined when slug is not found');
  });
});

test('getRelatedCaseStudies', async (t) => {
  await t.test('returns up to 2 related case studies by default excluding the given slug', () => {
    const targetSlug = caseStudies[0].slug;
    const result = getRelatedCaseStudies(targetSlug);

    assert.ok(Array.isArray(result), 'Should return an array');
    assert.strictEqual(result.length, 2, 'Should return exactly 2 items by default');

    const containsTarget = result.some(study => study.slug === targetSlug);
    assert.strictEqual(containsTarget, false, 'Should not contain the excluded slug');
  });

  await t.test('respects a custom limit parameter', () => {
    const targetSlug = caseStudies[0].slug;
    const customLimit = 1;
    const result = getRelatedCaseStudies(targetSlug, customLimit);

    assert.strictEqual(result.length, 1, 'Should return exactly 1 item when limit is 1');
  });

  await t.test('handles case where there are fewer case studies available than the limit', () => {
    const targetSlug = caseStudies[0].slug;
    // Assuming there are not 100 case studies in the static array
    const customLimit = 100;
    const result = getRelatedCaseStudies(targetSlug, customLimit);

    assert.strictEqual(result.length, caseStudies.length - 1, 'Should return all other case studies');
    assert.strictEqual(result.some(study => study.slug === targetSlug), false, 'Should not contain the excluded slug');
  });

  await t.test('returns the first N case studies if the given slug is not found', () => {
    const invalidSlug = 'non-existent-case-study-slug';
    const limit = 2;
    const result = getRelatedCaseStudies(invalidSlug, limit);

    assert.strictEqual(result.length, 2, 'Should return 2 items');
    assert.deepStrictEqual(result, caseStudies.slice(0, 2), 'Should return the first 2 items of the caseStudies array');
  });
});
