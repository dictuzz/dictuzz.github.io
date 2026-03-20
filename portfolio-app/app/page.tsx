import { PortfolioBoard } from '@/components/portfolio/PortfolioBoard';
import { getCaseStudies, getHomeContent } from '@/lib/content';

export default function PortfolioPage() {
  return <PortfolioBoard cases={getCaseStudies()} home={getHomeContent()} />;
}
