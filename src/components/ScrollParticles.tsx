import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RouteParticleSpec {
  id: string;
  side: 'left' | 'right';
  top: string;
  shape: 'chevron' | 'waypoint' | 'routeCurve' | 'orb';
  size: number;
  tone: 'gold' | 'sage' | 'emerald';
  travelX: number;
  travelY: number;
  rotate: number;
}

const ROUTE_PARTICLES: RouteParticleSpec[] = [
  { id: 'rp1', side: 'left', top: '11%', shape: 'chevron', size: 48, tone: 'gold', travelX: 110, travelY: -50, rotate: 16 },
  { id: 'rp2', side: 'right', top: '18%', shape: 'orb', size: 130, tone: 'sage', travelX: -120, travelY: 60, rotate: -30 },
  { id: 'rp3', side: 'left', top: '29%', shape: 'waypoint', size: 42, tone: 'sage', travelX: 115, travelY: -45, rotate: 12 },
  { id: 'rp4', side: 'right', top: '38%', shape: 'routeCurve', size: 86, tone: 'gold', travelX: -125, travelY: -55, rotate: -18 },
  { id: 'rp5', side: 'left', top: '49%', shape: 'orb', size: 145, tone: 'emerald', travelX: 110, travelY: 55, rotate: 15 },
  { id: 'rp6', side: 'right', top: '58%', shape: 'chevron', size: 46, tone: 'gold', travelX: -125, travelY: -50, rotate: -22 },
  { id: 'rp7', side: 'left', top: '69%', shape: 'routeCurve', size: 80, tone: 'gold', travelX: 118, travelY: -48, rotate: 20 },
  { id: 'rp8', side: 'right', top: '78%', shape: 'waypoint', size: 42, tone: 'sage', travelX: -115, travelY: 50, rotate: -14 },
  { id: 'rp9', side: 'left', top: '88%', shape: 'chevron', size: 42, tone: 'sage', travelX: 100, travelY: -40, rotate: 18 },
  { id: 'rp10', side: 'right', top: '92%', shape: 'orb', size: 115, tone: 'gold', travelX: -105, travelY: -35, rotate: 24 },
];

export function ScrollParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-scroll-particle]');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.9,
          },
        });

        items.forEach((el, idx) => {
          const fromX = Number(el.dataset.fromX || 0);
          const toY = Number(el.dataset.toY || 0);
          const toRotate = Number(el.dataset.toRotate || 0);
          const position = idx * 0.075;

          gsap.set(el, {
            x: fromX,
            y: 26,
            opacity: idx === 0 ? 0.3 : 0.08,
            scale: 0.84,
            rotate: 0,
          });

          tl.to(
            el,
            {
              x: 0,
              y: toY * 0.45,
              opacity: 0.62,
              scale: 1.04,
              rotate: toRotate * 0.55,
              duration: 0.16,
              ease: 'power2.out',
            },
            position
          ).to(
            el,
            {
              x: fromX * -0.16,
              y: toY,
              opacity: 0.15,
              scale: 0.9,
              rotate: toRotate,
              duration: 0.2,
              ease: 'power1.in',
            },
            position + 0.16
          );
        });
      });

      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-scroll-particle]');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.85,
          },
        });

        items.forEach((el, idx) => {
          const fromX = Number(el.dataset.fromX || 0) * 0.28;
          const toY = Number(el.dataset.toY || 0) * 0.5;
          const toRotate = Number(el.dataset.toRotate || 0) * 0.7;
          const position = idx * 0.075;

          gsap.set(el, { x: fromX, y: 14, opacity: 0.08, scale: 0.7, rotate: 0 });

          tl.to(
            el,
            {
              x: 0,
              y: toY * 0.5,
              opacity: 0.3,
              scale: 0.84,
              rotate: toRotate * 0.6,
              duration: 0.18,
              ease: 'power2.out',
            },
            position
          ).to(
            el,
            {
              x: fromX * -0.15,
              y: toY,
              opacity: 0.1,
              scale: 0.74,
              rotate: toRotate,
              duration: 0.18,
              ease: 'power1.in',
            },
            position + 0.18
          );
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {ROUTE_PARTICLES.map((p) => {
        const fromX = p.side === 'left' ? -p.travelX : p.travelX;
        const horizontalClass =
          p.side === 'left' ? 'left-2 sm:left-8' : 'right-2 sm:right-8';

        const strokeColor =
          p.tone === 'gold'
            ? '#DFBA78'
            : p.tone === 'sage'
              ? '#82CFA0'
              : '#1A7347';

        return (
          <div
            key={p.id}
            data-scroll-particle
            data-from-x={fromX}
            data-to-y={p.travelY}
            data-to-rotate={p.rotate}
            style={{ top: p.top }}
            className={`absolute ${horizontalClass} will-change-transform`}
          >
            {p.shape === 'orb' && (
              <div
                style={{
                  width: p.size,
                  height: p.size,
                  background: `radial-gradient(circle, ${strokeColor}2A 0%, transparent 70%)`,
                }}
                className="rounded-full blur-md"
              />
            )}

            {p.shape === 'chevron' && (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 64 64"
                fill="none"
                className="opacity-30"
              >
                <path
                  d="M16 26 H34 V44"
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="miter"
                />
                <path
                  d="M28 14 H46 V32"
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="miter"
                />
              </svg>
            )}

            {p.shape === 'waypoint' && (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 48 48"
                fill="none"
                className="opacity-35"
              >
                <path
                  d="M24 6C16.82 6 11 11.82 11 19C11 28.5 24 42 24 42C24 42 37 28.5 37 19C37 11.82 31.18 6 24 6Z"
                  stroke={strokeColor}
                  strokeWidth="2"
                  fill={`${strokeColor}14`}
                />
                <circle cx="24" cy="19" r="4.5" fill={strokeColor} />
              </svg>
            )}

            {p.shape === 'routeCurve' && (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 80 80"
                fill="none"
                className="opacity-35"
              >
                <path
                  d="M12 62 C 18 26, 42 14, 68 18"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="5 5"
                />
                <circle cx="12" cy="62" r="3.5" stroke={strokeColor} strokeWidth="2" fill="#012B17" />
                <circle cx="68" cy="18" r="4" fill={strokeColor} />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
