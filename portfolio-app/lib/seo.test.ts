import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { absoluteUrl, siteUrl } from './seo.ts';

describe('absoluteUrl', () => {
  test('returns the base URL when no path is provided', () => {
    assert.strictEqual(absoluteUrl(), siteUrl + '/');
  });

  test('returns the base URL when an empty string is provided', () => {
    assert.strictEqual(absoluteUrl(''), siteUrl + '/');
  });

  test('resolves a relative path without a leading slash', () => {
    assert.strictEqual(absoluteUrl('portfolio'), siteUrl + '/portfolio');
  });

  test('resolves a relative path with a leading slash', () => {
    assert.strictEqual(absoluteUrl('/portfolio'), siteUrl + '/portfolio');
  });

  test('preserves query parameters', () => {
    assert.strictEqual(absoluteUrl('/portfolio?foo=bar&baz=1'), siteUrl + '/portfolio?foo=bar&baz=1');
  });

  test('preserves URL fragments/hashes', () => {
    assert.strictEqual(absoluteUrl('/portfolio#section'), siteUrl + '/portfolio#section');
  });

  test('returns the input URL if it is already an absolute URL', () => {
    assert.strictEqual(absoluteUrl('https://other.com/path'), 'https://other.com/path');
    assert.strictEqual(absoluteUrl('http://insecure.com/'), 'http://insecure.com/');
  });

  test('resolves protocol-relative URLs correctly', () => {
    assert.strictEqual(absoluteUrl('//other.com/path'), 'https://other.com/path');
  });
});
