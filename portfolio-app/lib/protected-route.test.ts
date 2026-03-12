import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getProtectedAssetPath, getProtectedRoutePath, protectedAssetBasePath, type ProtectedRouteDescriptor } from './protected-route.ts';

describe('protected-route', () => {
  describe('getProtectedAssetPath', () => {
    it('should return the correct path for home', () => {
      const route: ProtectedRouteDescriptor = { kind: 'home' };
      assert.strictEqual(getProtectedAssetPath(route), `${protectedAssetBasePath}/home.json`);
    });

    it('should return the correct path for work', () => {
      const route: ProtectedRouteDescriptor = { kind: 'work', slug: 'my-project' };
      assert.strictEqual(getProtectedAssetPath(route), `${protectedAssetBasePath}/work--my-project.json`);
    });

    it('should return the correct path for thinking', () => {
      const route: ProtectedRouteDescriptor = { kind: 'thinking', slug: 'my-thoughts' };
      assert.strictEqual(getProtectedAssetPath(route), `${protectedAssetBasePath}/thinking--my-thoughts.json`);
    });

    it('should return the correct path for legacy', () => {
      const route: ProtectedRouteDescriptor = { kind: 'legacy', legacySlug: 'old-project' };
      assert.strictEqual(getProtectedAssetPath(route), `${protectedAssetBasePath}/legacy--old-project.json`);
    });
  });

  describe('getProtectedRoutePath', () => {
    it('should return the correct path for home', () => {
      const route: ProtectedRouteDescriptor = { kind: 'home' };
      assert.strictEqual(getProtectedRoutePath(route), '/portfolio/');
    });

    it('should return the correct path for work', () => {
      const route: ProtectedRouteDescriptor = { kind: 'work', slug: 'my-project' };
      assert.strictEqual(getProtectedRoutePath(route), '/portfolio/work/my-project/');
    });

    it('should return the correct path for thinking', () => {
      const route: ProtectedRouteDescriptor = { kind: 'thinking', slug: 'my-thoughts' };
      assert.strictEqual(getProtectedRoutePath(route), '/portfolio/thinking/my-thoughts/');
    });

    it('should return the correct path for legacy', () => {
      const route: ProtectedRouteDescriptor = { kind: 'legacy', legacySlug: 'old-project' };
      assert.strictEqual(getProtectedRoutePath(route), '/portfolio/old-project/');
    });
  });
});
