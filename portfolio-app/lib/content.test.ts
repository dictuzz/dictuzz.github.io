import { test } from 'node:test';
import assert from 'node:assert';
import { caseStudies } from '../content/case-studies';
import { getCaseStudy } from './content';

test('getCaseStudy returns undefined for missing slug with empty array mock', () => {
    const originalData = [...caseStudies];
    caseStudies.length = 0;

    try {
        const result = getCaseStudy('missing-slug');
        assert.strictEqual(result, undefined);
    } finally {
        caseStudies.push(...originalData);
    }
});
