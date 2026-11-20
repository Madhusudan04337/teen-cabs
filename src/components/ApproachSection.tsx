import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Link2, ShieldCheck } from 'lucide-react';
import { APPROACH_ITEMS } from '../data/teenCabsData';
import { gsap, ScrollTrigger, useGSAP } from '../motion/setup';
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
  const hasMountedRef = useRef(false);
  const refreshCardFnsRef = useRef<Array<() => void>>([]);

  // Refresh ScrollTrigger & card measurements cleanly when switching audience perspective tabs
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      refreshCardFnsRef.current.forEach((refreshFn) => refreshFn());
      ScrollTrigger.refresh();
    }, prefersReducedMotion ? 20 : 260);

    return () => window.clearTimeout(timer);
  }, [audienceLens, prefersReducedMotion]);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      const setupApproachAnimations = (isDesktop: boolean) => {
        refreshCardFnsRef.current = [];
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

        const copyBlocks = gsap.utils.toArray<HTMLElement>('[data-chapter-copy]', root);
        copyBlocks.forEach((copyEl) => {
          gsap.fromTo(
            copyEl,
            { y: offsetY, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: copyEl,
                start: 'top 86%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });

        const morphCards = gsap.utils.toArray<HTMLElement>('.tc-morph-card', root);
        morphCards.forEach((card) => {
          const slot = card.parentElement as HTMLElement | null;
          if (!slot) return;

          const dots = card.querySelector<HTMLElement>('.tc-pulse-dots');
          const contentItems = card.querySelectorAll<HTMLElement>(
            '.tc-card-top, .tc-card-quote'
          );

          // Measure natural expanded dimensions before collapsing
          slot.style.minHeight = '';
          gsap.set(card, { clearProps: 'all' });
          gsap.set(contentItems, { opacity: 0, y: 8 });

          const cs = window.getComputedStyle(card);
          const padTop = cs.paddingTop;
          const padBottom = cs.paddingBottom;
          const padLeft = cs.paddingLeft;
          const padRight = cs.paddingRight;
          let expandedWidth = slot.offsetWidth;
          let expandedHeight = card.offsetHeight;
          slot.style.minHeight = `${expandedHeight}px`;

          // Collapse into 56x56 circular botanical-green/gold pill
          gsap.set(card, {
            width: 56,
            height: 56,
            borderRadius: '999px',
            padding: 0,
            scale: 0,
          });
          if (dots) {
            gsap.set(dots, { autoAlpha: 1 });
          }

          let collapseWhenDone = false;

          const enterTl = gsap.timeline({ paused: true });
          enterTl.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });

          const expandTl = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
              if (collapseWhenDone) {
                collapseWhenDone = false;
                enterTl.reverse();
              }
            },
          });

          if (dots) {
            expandTl.to(dots, { autoAlpha: 0, duration: 0.16 });
          }

          expandTl
            .to(card, {
              width: () => expandedWidth,
              borderRadius: '16px',
              paddingLeft: padLeft,
              paddingRight: padRight,
              duration: 0.42,
              ease: 'power3.inOut',
            })
            .to(
              card,
              {
                height: () => expandedHeight,
                paddingTop: padTop,
                paddingBottom: padBottom,
                duration: 0.38,
                ease: 'power3.inOut',
              },
              '-=0.22'
            )
            .to(
              contentItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.06,
                ease: 'power2.out',
              },
              '-=0.2'
            );

          refreshCardFnsRef.current.push(() => {
            if (expandTl.progress() >= 0.99) {
              card.style.height = 'auto';
              expandedWidth = slot.offsetWidth;
              expandedHeight = card.offsetHeight;
              slot.style.minHeight = `${expandedHeight}px`;
              expandTl.invalidate();
              return;
            }

            const prevWidth = card.style.width;
            const prevHeight = card.style.height;
            const prevRadius = card.style.borderRadius;
            const prevPad = card.style.padding;
            const prevScale = card.style.transform;

            gsap.set(card, {
              width: slot.offsetWidth,
              height: 'auto',
              borderRadius: '16px',
              paddingTop: padTop,
              paddingBottom: padBottom,
              paddingLeft: padLeft,
              paddingRight: padRight,
              scale: 1,
            });
            expandedWidth = slot.offsetWidth;
            expandedHeight = card.offsetHeight;
            slot.style.minHeight = `${expandedHeight}px`;

            card.style.width = prevWidth;
            card.style.height = prevHeight;
            card.style.borderRadius = prevRadius;
            card.style.padding = prevPad;
            card.style.transform = prevScale;
            expandTl.invalidate();
          });

          const enterTrigger = ScrollTrigger.create({
            trigger: slot,
            start: 'top 88%',
            onEnter: () => {
              collapseWhenDone = false;
              enterTl.play();
            },
            onLeaveBack: () => {
              if (expandTl.progress() > 0) {
                collapseWhenDone = true;
              } else {
                enterTl.reverse();
              }
            },
          });

          const expandTrigger = ScrollTrigger.create({
            trigger: slot,
            start: 'top 78%',
            onEnter: () => expandTl.play(),
            onLeaveBack: () => expandTl.reverse(),
          });

          // If page loads already scrolled past triggers, settle immediately
          if (expandTrigger.progress > 0) {
            enterTl.progress(1);
            expandTl.progress(1);
          } else if (enterTrigger.progress > 0) {
            enterTl.progress(1);
          }
        });
      };

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        setupApproachAnimations(true);
        return () => {
          refreshCardFnsRef.current = [];
          root.querySelectorAll<HTMLElement>('.tc-card-slot').forEach((slot) => {
            slot.style.minHeight = '';
          });
        };
      });

      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => {
        setupApproachAnimations(false);
        return () => {
          refreshCardFnsRef.current = [];
          root.querySelectorAll<HTMLElement>('.tc-card-slot').forEach((slot) => {
            slot.style.minHeight = '';
          });
        };
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        refreshCardFnsRef.current = [];
        root.querySelectorAll<HTMLElement>('.tc-card-slot').forEach((slot) => {
          slot.style.minHeight = '';
        });
        root.querySelectorAll<HTMLElement>('.tc-morph-card').forEach((card) => {
          gsap.set(card, { clearProps: 'all' });
        });
        root.querySelectorAll<HTMLElement>('.tc-pulse-dots').forEach((dots) => {
          gsap.set(dots, { autoAlpha: 0 });
        });
        root
          .querySelectorAll<HTMLElement>('.tc-card-top, .tc-card-quote')
          .forEach((el) => {
            gsap.set(el, { clearProps: 'all' });
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
      className="relative z-10 overflow-x-clip border-t border-[#d4af37]/12 bg-transparent py-12 sm:py-16 lg:py-20"
    >
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
            className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 sm:mt-7 sm:gap-x-9"
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
        <ol className="mt-8 sm:mt-10 lg:mt-12">
          {APPROACH_ITEMS.map((item, index) => {
            const Icon =
              APPROACH_ICONS[item.id as keyof typeof APPROACH_ICONS] ?? Link2;
            const isContentFirst = index % 2 === 0;
            const lensHighlight =
              audienceLens === 'parent'
                ? item.detail
                : (TEEN_HIGHLIGHTS[item.id] ?? item.detail);

            return (
              <li
                key={item.id}
                data-approach-chapter
                className="relative py-8 sm:py-10 lg:py-12"
              >
                {/* Mobile stays strictly Copy -> Card (DOM order); Desktop >= 768px alternates zig-zag via grid placement */}
                <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:items-center md:gap-10 lg:gap-12 xl:gap-16">
                  {/* Copy Block (Always first in DOM -> order 1 on mobile) */}
                  <div
                    data-chapter-copy
                    className={`min-w-0 ${
                      isContentFirst
                        ? 'md:order-1 md:col-span-6'
                        : 'md:order-2 md:col-span-6 md:col-start-7 md:row-start-1'
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

                  {/* Morphing Card Slot (Always second in DOM -> order 2 on mobile) */}
                  <div
                    className={`tc-card-slot flex w-full min-w-0 items-start ${
                      isContentFirst
                        ? 'md:order-2 md:col-span-5 md:col-start-8'
                        : 'md:order-1 md:col-span-5 md:col-start-1 md:row-start-1'
                    }`}
                  >
                    <div className="tc-morph-card glass-emerald relative w-full overflow-hidden rounded-2xl border border-[#d4af37]/25 px-6 py-7 shadow-xl shadow-black/25 sm:px-8 sm:py-8">
                      {/* 3-Dot Pulse Indicator for collapsed circular pill */}
                      <div
                        className="tc-pulse-dots pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5"
                        aria-hidden="true"
                      >
                        <span className="tc-dot h-1.5 w-1.5 rounded-full bg-[#E6C477]" />
                        <span className="tc-dot h-1.5 w-1.5 rounded-full bg-[#E6C477]" />
                        <span className="tc-dot h-1.5 w-1.5 rounded-full bg-[#E6C477]" />
                      </div>

                      <div className="tc-card-inner">
                        <div className="tc-card-top flex items-center justify-between gap-4 border-b border-[#d4af37]/15 pb-4">
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
                            className="tc-card-quote mt-5 font-editorial text-xl leading-[1.42] font-normal italic text-[#E6C477] sm:text-2xl"
                          >
                            {lensHighlight}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
