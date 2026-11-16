import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function LogoIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDismissed(true);
    }
  }, []);

  useGSAP(
    () => {
      if (dismissed) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          onComplete: () => setDismissed(true),
        });

        tl.fromTo(
          '[data-intro-chevron-1]',
          { x: -16, y: 16, opacity: 0, scale: 0.86 },
          { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' }
        )
          .fromTo(
            '[data-intro-chevron-2]',
            { x: -12, y: 12, opacity: 0, scale: 0.86 },
            { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
            '-=0.28'
          )
          .fromTo(
            '[data-intro-wordmark]',
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.38, stagger: 0.08, ease: 'power3.out' },
            '-=0.22'
          )
          .to(
            logoWrapRef.current,
            { scale: 1.02, opacity: 0, duration: 0.36, ease: 'power2.inOut' },
            '+=0.22'
          )
          .to(
            overlayRef.current,
            { opacity: 0, pointerEvents: 'none', duration: 0.48, ease: 'power2.out' },
            '-=0.24'
          );
      });

      return () => mm.revert();
    },
    { scope: overlayRef, dependencies: [dismissed] }
  );

  if (dismissed) return null;

  return (
    <div
      ref={overlayRef}
      onClick={() => setDismissed(true)}
      role="presentation"
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-[#032A1D]"
    >
      <div
        ref={logoWrapRef}
        className="flex flex-col items-center text-center"
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <path
            data-intro-chevron-1
            d="M14 27 H33 V46"
            stroke="#E6C477"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="miter"
          />
          <path
            data-intro-chevron-2
            d="M27 14 H47 V34"
            stroke="#E6C477"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="miter"
          />
        </svg>

        <p
          data-intro-wordmark
          className="mt-4 text-3xl font-bold tracking-tight text-[#E6C477] sm:text-4xl"
        >
          Teen Cabs
        </p>
        <p
          data-intro-wordmark
          className="mt-1 text-xs font-medium tracking-[0.2em] text-[#D4E1D8] uppercase"
        >
          A Forgeit Groups Company
        </p>
      </div>
    </div>
  );
}
