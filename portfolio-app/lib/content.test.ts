import { test } from 'node:test';
import assert from 'node:assert';
import {
    getAliasTarget,
    getPortfolioCaseStudies,
    getPortfolioCaseStudy,
    getRelatedCaseStudies,
    getSharedSiteConfig
} from './content';

test('getPortfolioCaseStudy returns undefined for missing slug', () => {
    const result = getPortfolioCaseStudy('missing-slug');
    assert.strictEqual(result, undefined);
});

test('getAliasTarget resolves a configured alias to its canonical slug', () => {
    const target = getAliasTarget('automation-directive');

    assert.ok(target);
    assert.strictEqual(target?.target, 'automation-mandate');
    assert.strictEqual(target?.title, 'The Automation Mandate');
});

test('getPortfolioCaseStudy returns the canonical case for a known slug', () => {
    const caseStudy = getPortfolioCaseStudy('kpi-governance-record');

    assert.ok(caseStudy);
    assert.strictEqual(caseStudy?.title, 'KPI-Based Governance');
});

test('getRelatedCaseStudies excludes the current case and respects the limit', () => {
    const related = getRelatedCaseStudies('automation-mandate', 2);

    assert.strictEqual(related.length, 2);
    assert.ok(related.every((entry) => entry.slug !== 'automation-mandate'));
});

test('getPortfolioCaseStudies keeps slugs unique', () => {
    const slugs = getPortfolioCaseStudies().map((entry) => entry.slug);
    assert.strictEqual(new Set(slugs).size, slugs.length);
});

test('getSharedSiteConfig exposes centralized profile data', () => {
    const siteConfig = getSharedSiteConfig();
    assert.strictEqual(siteConfig.profile.handle, 'dictuzz');
    assert.strictEqual(siteConfig.contact.email, 'contact@dictuzz.me');
});
