import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { getProtectedAssetPath, getProtectedRoutePath, protectedAssetBasePath } from './protected-route.ts';

describe('Protected Route Utility Functions', () => {
  describe('getProtectedAssetPath', () => {
    test('returns correct path for "home" route', () => {
      const result = getProtectedAssetPath({ kind: 'home' });
      assert.equal(result, `${protectedAssetBasePath}/home.json`);
    });

    test('returns correct path for "work" route', () => {
      const result = getProtectedAssetPath({ kind: 'work', slug: 'project-a' });
      assert.equal(result, `${protectedAssetBasePath}/work--project-a.json`);
    });

    test('returns correct path for "thinking" route', () => {
      const result = getProtectedAssetPath({ kind: 'thinking', slug: 'my-thoughts' });
      assert.equal(result, `${protectedAssetBasePath}/thinking--my-thoughts.json`);
    });

    test('returns correct path for "legacy" route', () => {
      const result = getProtectedAssetPath({ kind: 'legacy', legacySlug: 'old-post' });
      assert.equal(result, `${protectedAssetBasePath}/legacy--old-post.json`);
    });
  });

  describe('getProtectedRoutePath', () => {
    test('returns correct route for "home" route', () => {
      const result = getProtectedRoutePath({ kind: 'home' });
      assert.equal(result, '/portfolio/');
    });

    test('returns correct route for "work" route', () => {
      const result = getProtectedRoutePath({ kind: 'work', slug: 'project-b' });
      assert.equal(result, '/portfolio/work/project-b/');
    });

    test('returns correct route for "thinking" route', () => {
      const result = getProtectedRoutePath({ kind: 'thinking', slug: 'more-thoughts' });
      assert.equal(result, '/portfolio/thinking/more-thoughts/');
    });

    test('returns correct route for "legacy" route', () => {
      const result = getProtectedRoutePath({ kind: 'legacy', legacySlug: 'another-post' });
      assert.equal(result, '/portfolio/another-post/');
    });
  });
});
