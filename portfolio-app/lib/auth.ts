export const PORTFOLIO_ACCESS_COOKIE = 'dictuzz-portfolio-access';
export const DEFAULT_PORTFOLIO_ACCESS_KEY = 'dictuzzportfolio';

export function getPortfolioRedirectTarget(pathname: string, search: string) {
  if (pathname.startsWith('/portfolio')) {
    return `${pathname}${search}`;
  }

  return `/portfolio${pathname}${search}`;
}
