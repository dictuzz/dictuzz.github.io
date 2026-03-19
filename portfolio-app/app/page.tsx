'use client';

import { EtherealShadow } from '@/components/ui/EtherealShadow';
import { MagneticCursor } from '@/components/animations/MagneticCursor';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';

import { SkillsSection } from '@/components/sections/SkillsSection';

import { ContactSection } from '@/components/sections/ContactSection';

export default function PortfolioPage() {
  return (
    <>
      {/* Global background layer */}
      <EtherealShadow />

      {/* Global UI overlays */}
      <MagneticCursor />
      <ScrollProgress />

      {/* Page content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
}
