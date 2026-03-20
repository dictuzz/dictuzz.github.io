import { test } from 'node:test';
import assert from 'node:assert';
import { caseStudies } from '../content/case-studies';
import { getAliasTarget, getCaseStudy, getRelatedCaseStudies } from './content';

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

test('getAliasTarget resolves a configured alias to its canonical slug', () => {
    const target = getAliasTarget('automation-directive');

    assert.ok(target);
    assert.strictEqual(target?.target, 'automation-mandate');
    assert.strictEqual(target?.title, 'The Automation Mandate');
});

test('getCaseStudy returns the canonical case for a known slug', () => {
    const caseStudy = getCaseStudy('kpi-governance-record');

    assert.ok(caseStudy);
    assert.strictEqual(caseStudy?.title, 'KPI-Based Governance');
});

test('getRelatedCaseStudies excludes the current case and respects the limit', () => {
    const related = getRelatedCaseStudies('automation-mandate', 2);

    assert.strictEqual(related.length, 2);
    assert.ok(related.every((entry) => entry.slug !== 'automation-mandate'));
});
