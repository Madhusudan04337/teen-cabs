import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function LivingAtmosphere() {
  const glowRef = useRef<HTMLDivElement>(null);
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

      if (finePointer && glowEl) {
        const xTo = gsap.quickTo(glowEl, 'x', { duration: 0.75, ease: 'power3.out' });
        const yTo = gsap.quickTo(glowEl, 'y', { duration: 0.75, ease: 'power3.out' });

        const handleMove = (e: PointerEvent) => {
          xTo(e.clientX - 240);
          yTo(e.clientY - 240);
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

      {/* Subtle Pointer Ambient Light (pure gradient, zero blur filter repaint) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-0 hidden h-[480px] w-[480px] transform-gpu rounded-full opacity-45 will-change-transform md:block"
        style={{
          background:
            'radial-gradient(circle, rgba(230, 196, 119, 0.08) 0%, rgba(11, 73, 51, 0.14) 38%, transparent 68%)',
        }}
      />
    </>
  );
}
