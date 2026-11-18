import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Link2, Navigation, ShieldCheck, UserPlus } from 'lucide-react';
import { JOURNEY_STEPS } from '../data/teenCabsData';
import { gsap, useGSAP } from '../motion/setup';

const STEP_ICONS = [UserPlus, Link2, Navigation, ShieldCheck] as const;

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Progressive route drawing with DrawSVGPlugin scrubbed by ScrollTrigger
        if (routePathRef.current) {
          gsap.fromTo(
            routePathRef.current,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'center 42%',
                scrub: 0.3,
              },
            }
          );
        }

        // Smooth reversible node cascade
        gsap.fromTo(
          '[data-journey-node]',
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.09,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 86%',
              end: 'bottom 4%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="journey-heading"
      className="relative z-10 border-t border-[#d4af37]/12 bg-[#061a12]/25 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
              How it works
            </p>
            <h2
              id="journey-heading"
              className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
            >
              Simple steps.
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                Safer journeys.
              </span>
            </h2>
          </div>

          <p className="max-w-[38ch] text-base leading-[1.65] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
            From family sign-up to verified drop-off in four calm steps.
          </p>
        </div>

        <div className="relative mt-14 sm:mt-16">
          {/* Desktop Horizontal Connecting SVG Route Line aligned through all four icon centers */}
          <svg
            viewBox="0 0 1120 64"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-0 hidden h-16 w-full lg:block"
          >
            <path
              d="M 32 32 Q 177 8, 322 32 T 612 32 T 902 32"
              stroke="#285640"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <path
              ref={routePathRef}
              d="M 32 32 Q 177 8, 322 32 T 612 32 T 902 32"
              stroke="#E6C477"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Mobile Vertical Connecting Line */}
          <div
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-7 w-px bg-[#285640] lg:hidden"
          />

          <ol className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-10">
            {JOURNEY_STEPS.map((item, idx) => {
              const Icon = STEP_ICONS[idx];
              const isHighlighted = idx === activeStepIndex;
              const stepNum = `0${idx + 1}`;
              return (
                <li key={item.id} data-journey-node className="relative pl-18 lg:pl-0">
                  <button
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    aria-current={isHighlighted ? 'step' : undefined}
                    className="group flex w-full cursor-pointer flex-col items-start text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 max-lg:absolute max-lg:top-0 max-lg:left-0 lg:h-16 lg:w-16 ${
                          isHighlighted
                            ? 'bg-[#E6C477] text-[#032A1D] shadow-xl shadow-black/25'
                            : 'border border-[#285640] bg-[#0B4933] text-[#E6C477] group-hover:border-[#D9B45B]'
                        }`}
                      >
                        {isHighlighted && (
                          <span
                            aria-hidden="true"
                            className="animate-radar-ripple absolute inset-0 rounded-full ring-2 ring-[#E6C477]"
                          />
                        )}
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 lg:mt-6">
                      <span
                        className={`font-mono text-xs font-semibold tracking-wider ${
                          isHighlighted ? 'text-[#E6C477]' : 'text-[#B7C8BA]'
                        }`}
                      >
                        STEP {stepNum}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-px w-8 transition-colors ${
                          isHighlighted ? 'bg-[#E6C477]' : 'bg-[#285640]'
                        }`}
                      />
                    </div>

                    <h3
                      className={`mt-2 text-lg leading-snug font-semibold transition-colors sm:text-xl ${
                        isHighlighted
                          ? 'text-[#E6C477]'
                          : 'text-[#E8EEE8] group-hover:text-[#E6C477]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.68] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                      {item.description}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
