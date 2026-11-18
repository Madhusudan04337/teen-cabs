import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { gsap, Observer, useGSAP } from '../motion/setup';

const TICKER_ITEMS = [
  'SAFE RIDES',
  'VERIFIED DRIVERS',
  'PARENTAL PEACE OF MIND',
  'LIVE JOURNEY VISIBILITY',
  'TEEN-FIRST MOBILITY',
  'TRUSTED TRANSPORTATION',
  'PARENT-LINKED ACCOUNTS',
  'SUB-5S GPS CORRIDORS',
  '24/7 SAFETY DESK',
  'BUILT FOR GEN Z',
  'ONE-TAP APPROVALS',
  'A FORGEIT PRODUCT',
] as const;

function TickerTrack({
  hidden = false,
  reducedMotion = false,
}: {
  hidden?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={`flex shrink-0 items-center ${
        reducedMotion
          ? 'w-full flex-wrap justify-center gap-x-6 gap-y-2 px-6'
          : 'gap-8 pr-8 sm:gap-12 sm:pr-12'
      }`}
    >
      {TICKER_ITEMS.map((phrase, idx) => {
        const isGold = idx % 2 === 0;
        return (
          <div
            key={phrase}
            className={`flex shrink-0 items-center ${
              reducedMotion ? 'gap-6' : 'gap-8 sm:gap-12'
            }`}
          >
            <span
              className={`whitespace-nowrap text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm ${
                isGold ? 'text-[#E6C477]' : 'text-[#F3F0E6]'
              }`}
            >
              {phrase}
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#D9B45B]/75"
            />
          </div>
        );
      })}
    </div>
  );
}

export function VelocityRibbon() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !trackRef.current || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trackEl = trackRef.current;
        if (!trackEl) return;

        const baseLoop = gsap.to(trackEl, {
          xPercent: -50,
          duration: 48,
          ease: 'none',
          repeat: -1,
        });

        const speedState = { scale: 1 };
        let settleTween: gsap.core.Tween | null = null;

        const settleScale = (duration = 0.8) => {
          settleTween?.kill();
          settleTween = gsap.to(speedState, {
            scale: 1,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              baseLoop.timeScale(speedState.scale);
            },
          });
        };

        const scrollObserver = Observer.create({
          target: window,
          type: 'wheel,scroll,touch',
          onChangeY(self) {
            const impulse = Math.min(2.4, Math.abs(self.velocityY) * 0.0014);
            const nextScale = Math.max(0.75, Math.min(3.4, 1 + impulse));
            settleTween?.kill();
            speedState.scale = nextScale;
            baseLoop.timeScale(nextScale);
          },
          onStop() {
            settleScale(0.85);
          },
          onStopDelay: 0.14,
        });

        const dragObserver = Observer.create({
          target: sectionRef.current,
          type: 'pointer,touch',
          lockAxis: true,
          tolerance: 8,
          onDrag(self) {
            settleTween?.kill();
            const dragBoost = Math.max(0.45, Math.min(3.6, 1 - self.deltaX * 0.08));
            speedState.scale = dragBoost;
            baseLoop.timeScale(dragBoost);
          },
          onDragEnd() {
            settleScale(0.85);
          },
        });

        return () => {
          scrollObserver.kill();
          dragObserver.kill();
          settleTween?.kill();
          baseLoop.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Teen Cabs brand principles"
      className="group relative z-10 overflow-hidden border-y border-[#285640] bg-[#063B27] py-4 sm:py-5"
    >
      {/* Left & right soft gradient masks */}
      {!prefersReducedMotion && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#063B27] to-transparent sm:w-28"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#063B27] to-transparent sm:w-28"
          />
        </>
      )}

      <div className="space-y-3">
        {/* Single Seamless Horizontal Ticker driven by GSAP Observer + InertiaPlugin */}
        {prefersReducedMotion ? (
          <div className="flex w-full items-center justify-center">
            <TickerTrack reducedMotion />
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex w-max items-center select-none will-change-transform"
          >
            <TickerTrack />
            <TickerTrack hidden />
          </div>
        )}

        {/* Subtle Architectural Caption Bar */}
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 border-t border-[#285640]/70 px-6 pt-2.5 sm:px-8 lg:px-10">
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-[#B7C8BA] uppercase">
            Purpose-built teen commute infrastructure
          </span>
          <span className="hidden font-editorial text-xs italic text-[#E6C477] sm:inline">
            Parent supervision meets effortless Gen Z independence
          </span>
        </div>
      </div>
    </section>
  );
}

