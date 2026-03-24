import { PortfolioBoard } from '@/components/portfolio/PortfolioBoard';
import { getPortfolioCaseStudies, getPortfolioHomeContent } from '@/lib/content';

export default function PortfolioPage() {
  return <PortfolioBoard cases={getPortfolioCaseStudies()} home={getPortfolioHomeContent()} />;
}
