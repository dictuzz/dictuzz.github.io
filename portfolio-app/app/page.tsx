import { ProtectedPortfolioRoute } from '@/components/protected/ProtectedPortfolioRoute';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Private Portfolio',
  description: 'Access code required to view this private portfolio.',
  path: '/portfolio/'
});

export default function Page() {
  return <ProtectedPortfolioRoute route={{ kind: 'home' }} />;
}
