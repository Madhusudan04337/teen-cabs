import { useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface DustParticle {
  top: string;
  left: string;
  size: number;
  dx: string;
  dy: string;
  dur: string;
  delay: string;
  minOpacity: number;
  maxOpacity: number;
  desktopOnly?: boolean;
}

const GOLDEN_DUST_PARTICLES: ReadonlyArray<DustParticle> = [
  { top: '12%', left: '14%', size: 2, dx: '10px', dy: '-22px', dur: '15s', delay: '-2s', minOpacity: 0.14, maxOpacity: 0.4 },
  { top: '24%', left: '78%', size: 2.5, dx: '-12px', dy: '-18px', dur: '17s', delay: '-6s', minOpacity: 0.16, maxOpacity: 0.45 },
  { top: '38%', left: '42%', size: 1.5, dx: '8px', dy: '-14px', dur: '13s', delay: '-4s', minOpacity: 0.1, maxOpacity: 0.32, desktopOnly: true },
  { top: '48%', left: '86%', size: 2, dx: '-9px', dy: '-20px', dur: '19s', delay: '-9s', minOpacity: 0.14, maxOpacity: 0.38 },
  { top: '58%', left: '18%', size: 2.5, dx: '11px', dy: '-16px', dur: '16s', delay: '-1s', minOpacity: 0.16, maxOpacity: 0.42 },
  { top: '68%', left: '62%', size: 2, dx: '-10px', dy: '-24px', dur: '20s', delay: '-11s', minOpacity: 0.12, maxOpacity: 0.36, desktopOnly: true },
  { top: '79%', left: '29%', size: 1.5, dx: '7px', dy: '-15px', dur: '14s', delay: '-5s', minOpacity: 0.14, maxOpacity: 0.34 },
  { top: '86%', left: '74%', size: 2.5, dx: '-8px', dy: '-19px', dur: '18s', delay: '-8s', minOpacity: 0.15, maxOpacity: 0.44 },
  { top: '18%', left: '54%', size: 2, dx: '9px', dy: '-16px', dur: '21s', delay: '-13s', minOpacity: 0.12, maxOpacity: 0.34, desktopOnly: true },
  { top: '31%', left: '9%', size: 2, dx: '10px', dy: '-20px', dur: '16s', delay: '-7s', minOpacity: 0.12, maxOpacity: 0.35, desktopOnly: true },
  { top: '44%', left: '67%', size: 1.5, dx: '-7px', dy: '-14px', dur: '15s', delay: '-3s', minOpacity: 0.12, maxOpacity: 0.3, desktopOnly: true },
  { top: '72%', left: '91%', size: 2, dx: '-11px', dy: '-18px', dur: '17s', delay: '-10s', minOpacity: 0.14, maxOpacity: 0.38, desktopOnly: true },
  { top: '91%', left: '48%', size: 2, dx: '6px', dy: '-16px', dur: '19s', delay: '-4s', minOpacity: 0.12, maxOpacity: 0.35 },
  { top: '8%', left: '90%', size: 2, dx: '-8px', dy: '-14px', dur: '16s', delay: '-12s', minOpacity: 0.12, maxOpacity: 0.36, desktopOnly: true },
];

export function LivingAtmosphere() {
  const glowRef = useRef<HTMLDivElement>(null);
  const orbFieldRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }

      const finePointer = window.matchMedia('(pointer: fine)').matches;
      const glowEl = glowRef.current;
      const orbFieldEl = orbFieldRef.current;

      if (finePointer && glowEl && orbFieldEl) {
        const xToGlow = gsap.quickTo(glowEl, 'x', { duration: 0.85, ease: 'power3.out' });
        const yToGlow = gsap.quickTo(glowEl, 'y', { duration: 0.85, ease: 'power3.out' });
        const xToOrbs = gsap.quickTo(orbFieldEl, 'x', { duration: 1.4, ease: 'power2.out' });
        const yToOrbs = gsap.quickTo(orbFieldEl, 'y', { duration: 1.4, ease: 'power2.out' });

        const handleMove = (e: PointerEvent) => {
          xToGlow(e.clientX - 240);
          yToGlow(e.clientY - 240);

          const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
          const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
          xToOrbs(-xNorm * 26);
          yToOrbs(-yNorm * 22);
        };

        window.addEventListener('pointermove', handleMove, { passive: true });
        return () => window.removeEventListener('pointermove', handleMove);
      }
    });

    return () => mm.revert();
  });

  return (
    <>
      {/* Top Scroll Progress Indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] bg-transparent"
      >
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 transform-gpu bg-gradient-to-r from-[#D9B45B] to-[#E6C477] will-change-transform"
        />
      </div>

      {/* Fixed Ambient Emerald & Warm Gold Backdrop Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#061a12]"
      >
        {/* Cursor-Shifted Blurred Light Orbs */}
        <div
          ref={orbFieldRef}
          className="absolute -inset-12 transform-gpu will-change-transform"
        >
          {/* Orb 1: Deep Emerald (#0f4c36) drifting top-left */}
          <div className="animate-orb-one absolute -top-24 -left-16 h-[360px] w-[360px] rounded-full bg-[#0f4c36]/75 blur-[64px] will-change-transform sm:h-[520px] sm:w-[520px] sm:blur-[76px]" />

          {/* Orb 2: Warm Yellowish-Gold (#d4af37) at subtle low opacity drifting top/mid-right */}
          <div className="animate-orb-two absolute top-[18%] -right-20 h-[300px] w-[300px] rounded-full bg-[#d4af37]/[0.13] blur-[68px] will-change-transform sm:h-[460px] sm:w-[460px] sm:blur-[80px]" />

          {/* Orb 3: Deep Emerald (#0f4c36) + subtle warm-gold core drifting lower-left */}
          <div className="animate-orb-three absolute -bottom-24 left-[22%] h-[340px] w-[340px] rounded-full bg-[#0f4c36]/65 blur-[68px] will-change-transform sm:h-[500px] sm:w-[500px] sm:blur-[80px]" />

          {/* Orb 4: Soft Low-Opacity Gold Accent drifting lower-center/right behind glass panels */}
          <div className="animate-orb-one hidden absolute bottom-[12%] right-[24%] h-[320px] w-[320px] rounded-full bg-[#d4af37]/[0.09] blur-[76px] will-change-transform md:block" />
        </div>

        {/* Subtle Floating Golden Micro-Dust Particles */}
        {GOLDEN_DUST_PARTICLES.map((particle, idx) => {
          const particleStyle = {
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: particle.delay,
            '--dust-dx': particle.dx,
            '--dust-dy': particle.dy,
            '--dust-dur': particle.dur,
            '--dust-min': String(particle.minOpacity),
            '--dust-max': String(particle.maxOpacity),
          } as CSSProperties;

          return (
            <span
              key={idx}
              style={particleStyle}
              className={`animate-dust-float absolute rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.45)] will-change-transform ${
                particle.desktopOnly ? 'hidden md:block' : ''
              }`}
            />
          );
        })}

        {/* Cursor-Following Soft Golden Glow (Desktop fine pointer only) */}
        <div
          ref={glowRef}
          className="fixed top-0 left-0 hidden h-[480px] w-[480px] transform-gpu rounded-full bg-[#d4af37]/[0.08] blur-[72px] will-change-transform md:block"
        />
      </div>
    </>
  );
}
