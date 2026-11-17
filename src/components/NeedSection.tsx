import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from 'motion/react';
import { BIGGER_PICTURE_STATS, NEED_ITEMS } from '../data/teenCabsData';

interface NeedSectionProps {
  compact?: boolean;
}

export function NeedSection({ compact = false }: NeedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroMetricRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const primaryStat = BIGGER_PICTURE_STATS[0];
  const riskStat = BIGGER_PICTURE_STATS[1];
  const volumeStat = BIGGER_PICTURE_STATS[2];
  const supervisionStat = BIGGER_PICTURE_STATS[3];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 32 : 14;

        // Chapter reveals
        gsap.utils.toArray<HTMLElement>('[data-chapter]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: offset, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });

        // Progressive gold corridor draw
        const corridorLine = sectionRef.current?.querySelector<SVGPathElement>(
          '[data-corridor-path]'
        );
        if (corridorLine) {
          const length = corridorLine.getTotalLength();
          gsap.set(corridorLine, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(corridorLine, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          });
        }

        // Hero 73% statistic counter animation
        if (heroMetricRef.current) {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: 73,
            duration: 1.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroMetricRef.current,
              start: 'top 86%',
              toggleActions: 'play none none none',
              once: true,
            },
            onUpdate: () => {
              if (heroMetricRef.current) {
                heroMetricRef.current.textContent = `${Math.round(counter.val)}%`;
              }
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="the-need"
      ref={sectionRef}
      aria-labelledby="need-heading"
      className={`relative z-10 overflow-x-clip bg-[#063B27] ${
        compact ? 'py-18 sm:py-24 lg:py-32' : 'py-20 sm:py-28 lg:py-36'
      }`}
    >
      {/* Continuous Subtle Vertical Gold Corridor Motif on Left Edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-6 z-0 w-px bg-[rgba(230,196,119,0.14)] sm:left-10 lg:left-16"
      >
        <svg
          className="absolute top-0 left-1/2 h-full w-4 -translate-x-1/2 overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 16 1000"
          fill="none"
        >
          <path
            data-corridor-path
            d="M 8 0 L 8 1000"
            stroke="#E6C477"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px] px-8 sm:px-12 lg:px-16">
        {/* SECTION INTRO */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <p className="mb-3 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm">
            Why we are building this
          </p>
          <h2
            id="need-heading"
            className="text-balance text-3xl leading-[1.08] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[3.25rem]"
          >
            The Three Chapters of{' '}
            <span className="font-editorial block font-normal italic text-[#E6C477]">
              Independent Transit.
            </span>
          </h2>
        </div>

        <div className="space-y-20 sm:space-y-28 lg:space-y-36">
          {/* CHAPTER 01 — THE PARENT'S VIEW */}
          <article data-chapter aria-labelledby="chapter-01-heading" className="relative">
            <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-[#E6C477] sm:text-sm">
              <span className="font-mono tabular-nums">01</span>
              <span aria-hidden="true" className="h-px w-8 bg-[#D9B45B]/55" />
              <span>The parent's view</span>
            </div>

            <div className="mt-6 grid grid-cols-1 items-baseline gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <span
                  ref={heroMetricRef}
                  className="block font-editorial text-7xl leading-none font-normal italic tabular-nums text-[#E6C477] sm:text-8xl lg:text-[8.5rem]"
                >
                  73%
                </span>
              </div>
              <div className="lg:col-span-7">
                <h3
                  id="chapter-01-heading"
                  className="font-editorial text-2xl leading-[1.3] font-normal italic text-[#F3F0E6] sm:text-3xl lg:text-[2.25rem]"
                >
                  “of parents worry about teen transport safety every day”
                </h3>
                <p className="mt-5 max-w-[44ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
                  Getting to school, tuition, or weekend practice should never mean
                  compromising on safety. Today’s ride platforms were never built
                  around teens or the families supporting them.
                </p>
              </div>
            </div>
          </article>

          {/* CHAPTER 02 — THE TEEN'S VIEW */}
          <article data-chapter aria-labelledby="chapter-02-heading" className="relative">
            <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
              <span className="font-mono text-[#E6C477] tabular-nums">02</span>
              <span aria-hidden="true" className="h-px w-8 bg-[#285640]" />
              <span>The teen's view</span>
            </div>

            <h3
              id="chapter-02-heading"
              className="mt-6 text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[2.75rem]"
            >
              Growing up means{' '}
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                going places.
              </span>
            </h3>

            <p className="mt-5 max-w-[48ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
              Teenagers need reliable everyday mobility to grow into independent adults,
              yet they are left navigating adult-oriented apps and unvetted transit.
            </p>

            {/* Three Open Editorial Problem Statements (No Accordions) */}
            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-[#285640] pt-10 lg:grid-cols-3 lg:gap-10">
              {NEED_ITEMS.map((item, idx) => {
                const indexLabel = `0${idx + 1}`;
                return (
                  <div key={item.id} className="flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs font-medium text-[#E6C477] tabular-nums">
                        {indexLabel}
                      </span>
                      <h4 className="mt-2 text-xl font-semibold tracking-tight text-[#E8EEE8]">
                        {item.title}
                      </h4>
                      <p className="mt-3 text-sm leading-[1.72] font-light text-[#D4E1D8]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* CHAPTER 03 — THE ENGINEERED SOLUTION */}
          <article data-chapter aria-labelledby="chapter-03-heading" className="relative">
            <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
              <span className="font-mono text-[#E6C477] tabular-nums">03</span>
              <span aria-hidden="true" className="h-px w-8 bg-[#285640]" />
              <span>The engineered solution</span>
            </div>

            <h3
              id="chapter-03-heading"
              className="mt-6 text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[2.75rem]"
            >
              Supervised mobility{' '}
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                built for families.
              </span>
            </h3>

            <p className="mt-5 max-w-[48ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
              Uniting parent-linked approvals, background-verified drivers, and live
              corridor telemetry into one cohesive platform.
            </p>

            {/* Asymmetric Editorial Data Composition (Hairlines & Typography instead of cards) */}
            <div className="mt-12 divide-y divide-[#285640] border-y border-[#285640]">
              {/* Stat 01 */}
              <div className="grid grid-cols-1 py-8 sm:grid-cols-12 sm:items-center sm:gap-8">
                <div className="sm:col-span-4">
                  <span className="font-mono text-4xl leading-none font-semibold tabular-nums text-[#E6C477] sm:text-5xl">
                    {primaryStat.value}
                  </span>
                </div>
                <div className="mt-3 sm:mt-0 sm:col-span-8">
                  <h4 className="text-xl font-semibold text-[#E8EEE8]">
                    {primaryStat.label}
                  </h4>
                  {primaryStat.description && (
                    <p className="mt-1.5 text-sm font-light text-[#D4E1D8]">
                      {primaryStat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stat 02 & 03 Split Row */}
              <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-12 sm:gap-8">
                <div className="sm:col-span-6">
                  <span className="font-mono text-4xl leading-none font-semibold tabular-nums text-[#F3F0E6] sm:text-5xl">
                    {riskStat.value}
                  </span>
                  <h4 className="mt-2.5 text-base font-medium text-[#E8EEE8]">
                    {riskStat.label}
                  </h4>
                  <p className="mt-1 text-xs text-[#B7C8BA]">
                    Safety risk comparison vs adult ride-hailing trips.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <span className="font-mono text-4xl leading-none font-semibold tabular-nums text-[#F3F0E6] sm:text-5xl">
                    {volumeStat.value}
                  </span>
                  <h4 className="mt-2.5 text-base font-medium text-[#E8EEE8]">
                    {volumeStat.label}
                  </h4>
                  <p className="mt-1 text-xs text-[#B7C8BA]">
                    Estimated annual rides required for school and coaching commutes.
                  </p>
                </div>
              </div>

              {/* Stat 04 */}
              <div className="grid grid-cols-1 py-8 sm:grid-cols-12 sm:items-center sm:gap-8">
                <div className="sm:col-span-4">
                  <span className="font-mono text-4xl leading-none font-semibold tabular-nums text-[#E6C477] sm:text-5xl">
                    {supervisionStat.value}
                  </span>
                </div>
                <div className="mt-3 sm:mt-0 sm:col-span-8">
                  <h4 className="text-xl font-semibold text-[#E8EEE8]">
                    {supervisionStat.label}
                  </h4>
                  <p className="mt-1.5 text-sm font-light text-[#D4E1D8]">
                    Active ride supervision and real-time guardian verification.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
