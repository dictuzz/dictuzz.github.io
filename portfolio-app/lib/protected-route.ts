export type ProtectedRouteDescriptor =
  | { kind: 'home' }
  | { kind: 'work'; slug: string }
  | { kind: 'thinking'; slug: string }
  | { kind: 'legacy'; legacySlug: string };

export const protectedAssetBasePath = '/portfolio/protected';

export function getProtectedAssetPath(route: ProtectedRouteDescriptor) {
  switch (route.kind) {
    case 'home':
      return `${protectedAssetBasePath}/home.json`;
    case 'work':
      return `${protectedAssetBasePath}/work--${route.slug}.json`;
    case 'thinking':
      return `${protectedAssetBasePath}/thinking--${route.slug}.json`;
    case 'legacy':
      return `${protectedAssetBasePath}/legacy--${route.legacySlug}.json`;
  }
}

export function getProtectedRoutePath(route: ProtectedRouteDescriptor) {
  switch (route.kind) {
    case 'home':
      return '/portfolio/';
    case 'work':
      return `/portfolio/work/${route.slug}/`;
    case 'thinking':
      return `/portfolio/thinking/${route.slug}/`;
    case 'legacy':
      return `/portfolio/${route.legacySlug}/`;
  }
}
