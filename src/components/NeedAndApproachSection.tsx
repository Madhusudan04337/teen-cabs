import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Compass, Link2, ShieldAlert, ShieldCheck, Smartphone, UserCheck } from 'lucide-react';
import {
  APPROACH_ITEMS,
  BIGGER_PICTURE_STATS,
  NEED_ITEMS,
} from '../data/teenCabsData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NEED_ICONS = {
  dedicated: Smartphone,
  safety: ShieldAlert,
  supervision: UserCheck,
} as const;

const APPROACH_ICONS = {
  'parent-linked': Link2,
  monitored: ShieldCheck,
  'gen-z': Compass,
} as const;

export function NeedAndApproachSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroMetricRef = useRef<HTMLSpanElement>(null);
  const timelineSpineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeNeedId, setActiveNeedId] = useState<string>(NEED_ITEMS[0].id);
  const [audienceLens, setAudienceLens] = useState<'parent' | 'teen'>('parent');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 36 : 16;

        // Smooth, reversible slide-ins from left
        gsap.utils.toArray<HTMLElement>('[data-snap-left]').forEach((el) => {
          gsap.fromTo(
            el,
            { x: -offset, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                end: 'bottom 4%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });

        // Smooth, reversible slide-ins from right
        gsap.utils.toArray<HTMLElement>('[data-snap-right]').forEach((el) => {
          gsap.fromTo(
            el,
            { x: offset, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                end: 'bottom 4%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });

        // Scroll-scrubbed gold progress spine on Introducing Teen Cabs timeline
        if (timelineSpineRef.current) {
          gsap.fromTo(
            timelineSpineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              transformOrigin: 'top center',
              scrollTrigger: {
                trigger: '[data-approach-timeline]',
                start: 'top 76%',
                end: 'bottom 58%',
                scrub: 0.35,
              },
            }
          );
        }

        // Staggered timeline milestone reveals
        gsap.utils.toArray<HTMLElement>('[data-approach-milestone]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                end: 'bottom 6%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });

        // Counter animation for 73%
        if (heroMetricRef.current) {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: 73,
            duration: 1.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroMetricRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
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
    { scope: containerRef }
  );

  const activeNeed =
    NEED_ITEMS.find((item) => item.id === activeNeedId) ?? NEED_ITEMS[0];

  return (
    <div ref={containerRef} className="relative z-10">
      {/* Section 2: The Need — Open, Unboxed Editorial Split */}
      <section
        id="the-need"
        aria-labelledby="need-heading"
        className="bg-[#063B27] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Open Interactive Reality Selector (Zero Boxes) */}
            <div data-snap-left className="lg:col-span-6">
              <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
                Why we are building this
              </p>
              <h2
                id="need-heading"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
              >
                Growing up means{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  going places.
                </span>
              </h2>

              <div className="mt-9 divide-y divide-[#285640] border-y border-[#285640]">
                {NEED_ITEMS.map((item) => {
                  const Icon = NEED_ICONS[item.id as keyof typeof NEED_ICONS];
                  const selected = item.id === activeNeed.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNeedId(item.id)}
                      aria-expanded={selected}
                      className="group flex w-full cursor-pointer items-start gap-4 py-5 text-left transition-colors sm:py-6"
                    >
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                          selected
                            ? 'scale-105 bg-[#E6C477] text-[#032A1D]'
                            : 'border border-[#285640] bg-[#0B4933] text-[#E6C477] group-hover:border-[#D9B45B]'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-lg leading-snug font-medium transition-colors sm:text-xl ${
                            selected
                              ? 'text-[#E6C477]'
                              : 'text-[#E8EEE8] group-hover:text-[#E6C477]'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <AnimatePresence initial={false}>
                          {selected && (
                            <motion.p
                              initial={
                                prefersReducedMotion
                                  ? false
                                  : { opacity: 0, height: 0 }
                              }
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={
                                prefersReducedMotion
                                  ? undefined
                                  : { opacity: 0, height: 0 }
                              }
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden pt-2.5 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]"
                            >
                              {item.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Open Typographic Stat Stage */}
            <div data-snap-right className="relative lg:col-span-6 lg:pl-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 right-4 h-72 w-72 transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.09)_0%,transparent_66%)]"
              />

              <p className="max-w-[46ch] rounded-2xl border border-[#285640] bg-[#0B4933] px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                Getting to school, tuition, or weekend practice should never mean
                compromising on safety. Today’s ride platforms were never built
                around teens or the families supporting them.
              </p>

              <div className="mt-9">
                <p className="text-xs font-semibold tracking-[0.12em] text-[#B7C8BA] uppercase">
                  The bigger picture
                </p>

                <div className="mt-4 flex flex-wrap items-baseline gap-6 pb-8">
                  <span
                    ref={heroMetricRef}
                    className="font-mono text-6xl leading-none font-medium tracking-tight tabular-nums text-[#E6C477] sm:text-7xl lg:text-[5.25rem]"
                  >
                    73%
                  </span>
                  <p className="max-w-[24ch] font-editorial text-lg leading-snug italic text-[#E8EEE8] sm:text-xl">
                    of parents worry about teen transport safety every day
                  </p>
                </div>

                {BIGGER_PICTURE_STATS.slice(0, 1).map((primaryStat) => (
                  <div
                    key={primaryStat.label}
                    aria-label={primaryStat.ariaLabel}
                    className="border-t border-[#285640] pt-7 pb-7"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-mono text-3xl leading-none font-bold tracking-tight text-[#E6C477] sm:text-4xl">
                        {primaryStat.value}
                      </span>
                      <span className="text-lg font-semibold tracking-tight text-[#F3F0E6] sm:text-xl">
                        {primaryStat.label}
                      </span>
                    </div>
                    {primaryStat.description && (
                      <p className="mt-2 max-w-[44ch] text-xs leading-relaxed text-[#B7C8BA] sm:text-sm">
                        {primaryStat.description}
                      </p>
                    )}
                  </div>
                ))}

                <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[#285640] pt-7 sm:grid-cols-3 sm:gap-x-8">
                  {BIGGER_PICTURE_STATS.slice(1).map((stat, idx) => (
                    <div
                      key={stat.label}
                      className={idx === 2 ? 'col-span-2 sm:col-span-1' : undefined}
                    >
                      <dd
                        aria-label={stat.ariaLabel}
                        className="font-mono text-2xl leading-none font-medium tabular-nums text-[#E8EEE8] sm:text-4xl"
                      >
                        {stat.value}
                      </dd>
                      <dt className="mt-2 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
                        {stat.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Approach — Open 3-Column Editorial Band */}
      <section
        id="our-approach"
        aria-labelledby="approach-heading"
        className="border-t border-[#285640] bg-[#032A1D] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-8 border-b border-[#285640] pb-10 lg:flex-row lg:items-end lg:pb-12">
            <div data-snap-left>
              <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
                Our approach
              </p>
              <h2
                id="approach-heading"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
              >
                Introducing{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  Teen Cabs.
                </span>
              </h2>
            </div>

            <div data-snap-right className="flex flex-col items-start gap-4 lg:items-end">
              <p className="max-w-[40ch] text-base leading-[1.65] font-light text-[#D4E1D8] lg:text-right sm:text-[1.0625rem]">
                Engineered from the ground up — trusted by parents and effortless
                for Gen Z.
              </p>

              <div
                role="group"
                aria-label="Audience perspective filter"
                className="inline-flex items-center gap-6 border-b border-[#285640]"
              >
                {(
                  [
                    { id: 'parent', label: 'Parents & guardians' },
                    { id: 'teen', label: 'Teen riders' },
                  ] as const
                ).map((lens) => {
                  const active = audienceLens === lens.id;
                  return (
                    <button
                      key={lens.id}
                      type="button"
                      onClick={() => setAudienceLens(lens.id)}
                      aria-pressed={active}
                      className={`relative min-h-[40px] cursor-pointer py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'text-[#E6C477]'
                          : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                      }`}
                    >
                      {lens.label}
                      {active && (
                        <motion.span
                          layoutId="approach-lens-line"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute right-0 -bottom-px left-0 h-[2px] bg-[#E6C477]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Connected Alternating Storytelling Timeline */}
          <div data-approach-timeline className="relative mt-14 sm:mt-16">
            {/* Background Connecting Spine Track */}
            <div
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-6 w-px bg-[#285640] md:left-1/2 md:-translate-x-1/2"
            />
            {/* Animated Gold Scroll Progress Spine */}
            <div
              ref={timelineSpineRef}
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-6 w-[2px] -translate-x-[0.5px] bg-gradient-to-b from-[#E6C477] via-[#D9B45B] to-[#E6C477]/60 md:left-1/2 md:-translate-x-1/2"
            />

            <ol className="space-y-12 sm:space-y-16 lg:space-y-20">
              {APPROACH_ITEMS.map((item, index) => {
                const Icon =
                  APPROACH_ICONS[item.id as keyof typeof APPROACH_ICONS] ?? Link2;
                const isEven = index % 2 === 0;
                const lensHighlight =
                  audienceLens === 'parent'
                    ? item.detail
                    : item.id === 'parent-linked'
                      ? 'Book verified rides in two taps — zero cash friction.'
                      : item.id === 'monitored'
                        ? 'Share live ETA cleanly with family until doorstep arrival.'
                        : 'Favorite music modes and quiet cabin settings saved automatically.';

                return (
                  <li
                    key={item.id}
                    data-approach-milestone
                    className="relative grid grid-cols-1 items-start gap-6 pl-16 md:grid-cols-12 md:items-center md:gap-10 md:pl-0"
                  >
                    {/* Milestone Center Node */}
                    <div
                      aria-hidden="true"
                      className="absolute top-0 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#E6C477]/60 bg-[#032A1D] font-mono text-sm font-semibold text-[#E6C477] shadow-lg shadow-black/35 ring-4 ring-[#032A1D] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                    >
                      {item.stepNumber}
                    </div>

                    {/* Narrative Column — Alternates Left (even) / Right (odd) on Desktop */}
                    <div
                      className={
                        isEven
                          ? 'md:col-span-5 md:col-start-1 md:pr-6 md:text-right'
                          : 'md:col-span-5 md:col-start-8 md:pl-6'
                      }
                    >
                      <div
                        className={`flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase ${
                          isEven ? 'md:justify-end' : ''
                        }`}
                      >
                        <span>{item.stepNumber}</span>
                        <span aria-hidden="true" className="text-[#285640]">
                          —
                        </span>
                        <span className="text-[#B7C8BA]">{item.subtitle}</span>
                      </div>

                      <h3 className="mt-2.5 text-2xl leading-snug font-semibold tracking-tight text-[#E8EEE8] sm:text-[1.75rem]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                        {item.description}
                      </p>
                    </div>

                    {/* Opposite Complementary Lens Detail Block */}
                    <div
                      className={
                        isEven
                          ? 'md:col-span-5 md:col-start-8 md:pl-6'
                          : 'md:col-span-5 md:col-start-1 md:row-start-1 md:pr-6 md:text-right'
                      }
                    >
                      <div
                        className={`flex items-start gap-3.5 border-t border-[#285640] pt-4 md:border-t-0 md:pt-0 ${
                          !isEven ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#285640] bg-[#0B4933] text-[#E6C477]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B7C8BA] uppercase">
                            {audienceLens === 'parent' ? 'For parents' : 'For teens'}
                          </p>
                          <AnimatePresence mode="wait">
                            <motion.p
                              key={`${item.id}-${audienceLens}`}
                              initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                              transition={{ duration: 0.22 }}
                              className="mt-1 font-editorial text-base leading-snug italic text-[#E6C477] sm:text-lg"
                            >
                              {lensHighlight}
                            </motion.p>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
