import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Link2, ShieldCheck } from 'lucide-react';
import { APPROACH_ITEMS } from '../data/teenCabsData';
import { gsap, useGSAP } from '../motion/setup';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_STAGGER,
} from '../motion/tokens';
import { useLenis } from '../motion/LenisContext';

const APPROACH_ICONS = {
  'parent-linked': Link2,
  monitored: ShieldCheck,
  'gen-z': Compass,
} as const;

const TEEN_HIGHLIGHTS: Record<string, string> = {
  'parent-linked': 'Book verified rides in two taps — zero cash friction.',
  monitored: 'Share live ETA cleanly with family until doorstep arrival.',
  'gen-z': 'Favorite music modes and quiet cabin settings saved automatically.',
};

const PERSPECTIVE_OPTIONS = [
  { id: 'parent', label: 'Parents & guardians' },
  { id: 'teen', label: 'Teen riders' },
] as const;

export function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useLenis();
  const [audienceLens, setAudienceLens] = useState<'parent' | 'teen'>('parent');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offsetY = isDesktop ? MOTION_DISTANCE.desktopY : MOTION_DISTANCE.mobileY;

        const introEls = gsap.utils.toArray<HTMLElement>('[data-approach-intro]', root);
        if (introEls.length > 0) {
          gsap.fromTo(
            introEls,
            { y: offsetY * 0.8, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              stagger: MOTION_STAGGER.text,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: introEls[0],
                start: 'top 86%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>('[data-approach-chapter]', root).forEach((chapter) => {
          const blocks = gsap.utils.toArray<HTMLElement>('[data-chapter-block]', chapter);
          const rule = chapter.querySelector<HTMLElement>('[data-chapter-rule]');

          if (rule) {
            gsap.fromTo(
              rule,
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: 'left center',
                duration: MOTION_DURATION.reveal,
                ease: MOTION_EASE.editorial,
                clearProps: 'transform',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 86%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              }
            );
          }

          if (blocks.length > 0) {
            gsap.fromTo(
              blocks,
              { y: offsetY, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: MOTION_DURATION.reveal,
                stagger: MOTION_STAGGER.card,
                ease: MOTION_EASE.editorial,
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              }
            );
          }
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="our-approach"
      ref={sectionRef}
      aria-labelledby="approach-heading"
      className="relative z-10 overflow-x-clip border-t border-[#285640] bg-[#032A1D] py-18 sm:py-24 lg:py-30"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(11,73,51,0.34)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        {/* 1. LEFT-ALIGNED EDITORIAL INTRODUCTION + PERSPECTIVE SWITCHER */}
        <header className="max-w-3xl">
          <p
            data-approach-intro
            className="mb-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm"
          >
            Our approach
          </p>

          <h2
            id="approach-heading"
            data-approach-intro
            className="text-balance text-3xl leading-[1.1] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[3.25rem]"
          >
            Introducing{' '}
            <span className="font-editorial font-normal italic text-[#E6C477]">
              Teen Cabs.
            </span>
          </h2>

          <p
            data-approach-intro
            className="mt-5 max-w-[48ch] text-base leading-[1.72] font-light text-[#D4E1D8] sm:text-[1.0625rem]"
          >
            Engineered from the ground up — trusted by parents and effortless for
            Gen Z.
          </p>

          {/* Perspective Switcher placed directly below the introduction */}
          <div
            data-approach-intro
            role="group"
            aria-label="Audience perspective filter"
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-[#285640] sm:gap-x-9"
          >
            {PERSPECTIVE_OPTIONS.map((lens) => {
              const active = audienceLens === lens.id;
              return (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => setAudienceLens(lens.id)}
                  aria-pressed={active}
                  className={`relative min-h-[44px] shrink-0 cursor-pointer rounded-sm py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#E6C477]/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#032A1D] focus-visible:outline-none ${
                    active
                      ? 'text-[#E6C477]'
                      : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                  }`}
                >
                  {lens.label}
                  {active && (
                    <motion.span
                      layoutId="approach-lens-line"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 30 }
                      }
                      className="absolute right-0 -bottom-px left-0 h-[2px] bg-[#E6C477]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* 2. THREE SPACIOUS EDITORIAL CHAPTERS */}
        <ol className="mt-14 sm:mt-16 lg:mt-20">
          {APPROACH_ITEMS.map((item, index) => {
            const Icon =
              APPROACH_ICONS[item.id as keyof typeof APPROACH_ICONS] ?? Link2;
            const isContentFirst = index % 2 === 0;
            const lensHighlight =
              audienceLens === 'parent'
                ? item.detail
                : (TEEN_HIGHLIGHTS[item.id] ?? item.detail);

            const contentColumn = (
              <div
                data-chapter-block
                className={`min-w-0 ${
                  isContentFirst
                    ? 'lg:col-span-6'
                    : 'lg:col-span-6 lg:col-start-7'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <span
                    aria-hidden="true"
                    className="font-mono text-4xl leading-none font-light tracking-tight text-[#E6C477] tabular-nums sm:text-5xl lg:text-[3.5rem]"
                  >
                    {item.stepNumber}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-8 w-px shrink-0 bg-[#285640]"
                  />

                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E6C477]/28 bg-[#063B27] text-[#E6C477]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
                      <span className="sr-only">Chapter {item.stepNumber}: </span>
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <h3 className="mt-6 text-balance text-2xl leading-[1.18] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-[52ch] text-base leading-[1.75] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
                  {item.description}
                </p>
              </div>
            );

            const highlightColumn = (
              <div
                data-chapter-block
                className={`min-w-0 ${
                  isContentFirst
                    ? 'lg:col-span-5 lg:col-start-8'
                    : 'lg:col-span-5'
                }`}
              >
                <div className="relative rounded-2xl border-t border-[#E6C477]/35 bg-[#063B27]/42 px-6 py-7 sm:px-8 sm:py-8">
                  <div className="flex items-center justify-between gap-4 border-b border-[#285640]/85 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E6C477]/28 bg-[#032A1D] text-[#E6C477]">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-medium tracking-wide text-[#B7C8BA]">
                        {audienceLens === 'parent' ? 'For parents' : 'For teens'}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-[#E6C477]/80 tabular-nums">
                      {item.stepNumber}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${item.id}-${audienceLens}`}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.22, ease: MOTION_EASE.motionEditorial }
                      }
                      className="mt-5 font-editorial text-xl leading-[1.42] font-normal italic text-[#E6C477] sm:text-2xl"
                    >
                      {lensHighlight}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            );

            return (
              <li
                key={item.id}
                data-approach-chapter
                className="relative border-t border-[#285640]/80 py-14 sm:py-18 lg:py-24"
              >
                <span
                  aria-hidden="true"
                  data-chapter-rule
                  className="pointer-events-none absolute -top-px left-0 h-px w-16 bg-[#E6C477]/65 sm:w-24"
                />

                {/* DOM order strictly matches left-to-right visual reading order on desktop */}
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
                  {isContentFirst ? (
                    <>
                      {contentColumn}
                      {highlightColumn}
                    </>
                  ) : (
                    <>
                      {highlightColumn}
                      {contentColumn}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
