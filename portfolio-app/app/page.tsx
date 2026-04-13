import { PortfolioBoard } from '@/components/portfolio/PortfolioBoard';
import { getPortfolioCaseStudies, getPortfolioHomeContent } from '@/lib/content';
import { toBoardCases } from '@/data/cases';

export default function PortfolioPage() {
  return <PortfolioBoard cases={toBoardCases(getPortfolioCaseStudies())} home={getPortfolioHomeContent()} />;
}
