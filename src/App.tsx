/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactSection } from './components/ContactSection';
import { ExperienceShowcase } from './components/ExperienceShowcase';
import { HeroSection } from './components/HeroSection';
import { JourneyAndTeamSection } from './components/JourneyAndTeamSection';
import { LivingAtmosphere } from './components/LivingAtmosphere';
import { LogoIntro } from './components/LogoIntro';
import { Navbar } from './components/Navbar';
import { NeedAndApproachSection } from './components/NeedAndApproachSection';
import { VelocityRibbon } from './components/VelocityRibbon';
import { WaitlistFooterSection } from './components/WaitlistFooterSection';
import { WaitlistModal } from './components/WaitlistModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let rafCallback: ((time: number) => void) | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      lenis.on('scroll', ScrollTrigger.update);

      rafCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!target) return;
      const hash = target.getAttribute('href');
      if (!hash || hash === '#') return;
      const el = document.querySelector(hash);
      if (!el) return;

      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: -64, duration: 1.1 });
      } else {
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = window.setTimeout(refresh, 450);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', refresh);
      window.clearTimeout(timer);
      if (rafCallback) {
        gsap.ticker.remove(rafCallback);
      }
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#012B17] text-[#F7F3E9]">
      <LogoIntro />
      <LivingAtmosphere />
      <Navbar onOpenWaitlist={() => setWaitlistOpen(true)} />

      <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
        <HeroSection onOpenWaitlist={() => setWaitlistOpen(true)} />
        <VelocityRibbon />
        <NeedAndApproachSection />
        <ExperienceShowcase />
        <JourneyAndTeamSection />
        <ContactSection />
        <WaitlistFooterSection onOpenWaitlist={() => setWaitlistOpen(true)} />
      </main>

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </div>
  );
}
