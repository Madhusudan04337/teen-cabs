import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ShieldAlert, Smartphone, UserCheck } from 'lucide-react';
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

export function NeedAndApproachSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroMetricRef = useRef<HTMLSpanElement>(null);
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

        // Staggered elevated pillars rising smoothly
        gsap.fromTo(
          '[data-approach-col]',
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.11,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '[data-approach-grid]',
              start: 'top 88%',
              end: 'bottom 4%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

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

                <dl className="grid grid-cols-2 gap-x-10 gap-y-8 border-t border-[#285640] pt-8">
                  {BIGGER_PICTURE_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dd
                        aria-label={stat.ariaLabel}
                        className="font-mono text-3xl leading-none font-medium tabular-nums text-[#E8EEE8] sm:text-4xl"
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

          {/* 3-Column Elevated Pillars */}
          <div
            data-approach-grid
            className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10 lg:gap-12"
          >
            {APPROACH_ITEMS.map((item) => {
              const lensHighlight =
                audienceLens === 'parent'
                  ? item.detail
                  : item.id === 'parent-linked'
                    ? 'Book verified rides in two taps — zero cash friction.'
                    : item.id === 'monitored'
                      ? 'Share live ETA cleanly with family until doorstep arrival.'
                      : 'Favorite music modes and quiet cabin settings saved automatically.';

              return (
                <article
                  key={item.id}
                  data-approach-col
                  className="group rounded-2xl border border-[#285640] bg-[#0B4933] p-6 transition-colors hover:border-[#D9B45B]"
                >
                  <h3 className="text-xl leading-snug font-medium text-[#E8EEE8] transition-colors group-hover:text-[#E6C477] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                    {item.description}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${item.id}-${audienceLens}`}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 text-xs font-semibold tracking-wide text-[#E6C477] sm:text-sm"
                    >
                      {lensHighlight}
                    </motion.p>
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
