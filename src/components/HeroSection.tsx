import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Navigation,
  Pause,
  Play,
  ShieldCheck,
} from 'lucide-react';
import { Flip, gsap, SplitText, useGSAP } from '../motion/setup';
import { RouteMapCanvas } from './RouteMapCanvas';

function attachMagneticButton(el: HTMLElement | null, strength = 0.14): () => void {
  if (!el || !window.matchMedia('(pointer: fine)').matches) {
    return () => {};
  }

  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

  const handleMove = (event: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    xTo(relX * strength);
    yTo(relY * strength);
  };

  const handleLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener('pointermove', handleMove);
  el.addEventListener('pointerleave', handleLeave);

  return () => {
    el.removeEventListener('pointermove', handleMove);
    el.removeEventListener('pointerleave', handleLeave);
  };
}

interface HeroSectionProps {
  onOpenWaitlist: () => void;
}

const STAGES = ['pickup', 'dropoff'] as const;
type RideStage = (typeof STAGES)[number];

export function HeroSection({ onOpenWaitlist }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mapRevealRef = useRef<HTMLDivElement>(null);
  const stageVisualRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const widgetFlipStateRef = useRef<Flip.FlipState | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeCheckpoint, setActiveCheckpoint] = useState<RideStage>('pickup');
  const [perspectiveMode, setPerspectiveMode] = useState<'parent' | 'teen'>('parent');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const captureWidgetFlip = useCallback(() => {
    if (prefersReducedMotion || !stageVisualRef.current) return;
    const targets = stageVisualRef.current.querySelectorAll('[data-flip-id]');
    if (targets.length > 0) {
      widgetFlipStateRef.current = Flip.getState(targets);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      captureWidgetFlip();
      setActiveCheckpoint((prev) => STAGES[(STAGES.indexOf(prev) + 1) % STAGES.length]);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [captureWidgetFlip, isAutoPlaying, prefersReducedMotion]);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isMobile = window.innerWidth < 768;
        let cancelled = false;
        let headingSplit: SplitText | null = null;

        // Scene 01: Staggered Editorial Headline reveal using SplitText masked lines & words
        const initSplitHeading = () => {
          if (cancelled || !headingRef.current) return;
          headingSplit = SplitText.create(headingRef.current, {
            type: 'lines,words',
            mask: 'lines',
            linesClass: 'pb-[0.06em] -mb-[0.06em]',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.words, {
                yPercent: 115,
                opacity: 0,
                duration: isMobile ? 0.72 : 0.85,
                delay: isMobile ? 0.04 : 0.14,
                stagger: 0.055,
                ease: 'expo.out',
                clearProps: 'transform,opacity',
              });
            },
          });
        };

        if (document.fonts?.ready) {
          document.fonts.ready.then(initSplitHeading);
        } else {
          initSplitHeading();
        }

        const eyebrowEl = root.querySelector<HTMLElement>('[data-hero-eyebrow]');
        if (eyebrowEl) {
          gsap.fromTo(
            eyebrowEl,
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: 0.02,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
            }
          );
        }

        // Scene 02: Progressive Map / Route Reveal
        if (mapRevealRef.current) {
          gsap.fromTo(
            mapRevealRef.current,
            {
              clipPath: isMobile
                ? 'inset(12% 0% 12% 0% round 20px)'
                : 'inset(6% 0% 24% 0% round 24px)',
              scale: 0.96,
              opacity: 0,
            },
            {
              clipPath: 'inset(0% 0% 0% 0% round 24px)',
              scale: 1,
              opacity: 1,
              duration: isMobile ? 0.95 : 0.9,
              delay: isMobile ? 0.32 : 0.28,
              ease: 'expo.out',
              clearProps: 'clipPath,transform,opacity',
            }
          );
        }

        // Scene 03: Supporting Copy & CTAs
        const copyEls = gsap.utils.toArray<HTMLElement>('[data-hero-copy]', root);
        if (copyEls.length > 0) {
          gsap.fromTo(
            copyEls,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: isMobile ? 0.44 : 0.42,
              stagger: 0.08,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
            }
          );
        }

        const ctaEls = gsap.utils.toArray<HTMLElement>('[data-hero-cta]', root);
        if (ctaEls.length > 0) {
          gsap.fromTo(
            ctaEls,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: isMobile ? 0.56 : 0.56,
              stagger: 0.08,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
            }
          );
        }

        // Desktop Pointer Tilt & Scroll Parallax
        if (stageVisualRef.current && window.matchMedia('(pointer: fine)').matches) {
          gsap.set(stageVisualRef.current, { transformPerspective: 1100 });

          gsap.to(stageVisualRef.current, {
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.35,
            },
          });
        }

        const detachMagnetic = attachMagneticButton(ctaBtnRef.current, 0.14);
        return () => {
          cancelled = true;
          headingSplit?.revert();
          detachMagnetic();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  // Flip transitions for Live Route Preview perspective & checkpoint indicators
  useGSAP(
    () => {
      if (prefersReducedMotion || !widgetFlipStateRef.current || !stageVisualRef.current) return;
      const state = widgetFlipStateRef.current;
      widgetFlipStateRef.current = null;

      Flip.from(state, {
        targets: stageVisualRef.current.querySelectorAll('[data-flip-id]'),
        duration: 0.34,
        ease: 'power3.out',
        nested: true,
      });
    },
    {
      scope: stageVisualRef,
      dependencies: [perspectiveMode, activeCheckpoint, prefersReducedMotion],
    }
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !stageVisualRef.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(stageVisualRef.current, {
      rotateY: xRatio * 6,
      rotateX: -yRatio * 4.5,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handlePointerLeave = () => {
    if (!stageVisualRef.current) return;
    gsap.to(stageVisualRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const routeProgress = {
    pickup: {
      progressPercent: 28,
      eta: 'Pickup verified at 04:12 PM',
      location: 'Oakridge High North Gate',
      parentStatus: 'Teen boarded with verified driver Arjun K.',
      teenStatus: 'Driver arrived at North Gate — Seatbelt & Lo-Fi ready',
    },
    dropoff: {
      progressPercent: 100,
      eta: 'Arrived safely at 04:29 PM',
      location: 'Home, Maple Street',
      parentStatus: 'Safe arrival confirmed and summary delivered',
      teenStatus: 'Arrived at Home — Wallet auto-settled cleanly',
    },
  }[activeCheckpoint];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative z-10 overflow-hidden bg-transparent pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
    >

      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* SCENE 01 — EDITORIAL HEADLINE & SCENE 03 — NEXT STEP */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-4 lg:order-1 lg:col-span-6">
            <p
              data-hero-eyebrow
              className="text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm"
            >
              A safer way to move forward
            </p>

            <h1
              id="hero-heading"
              ref={headingRef}
              className="text-balance text-[clamp(1.875rem,5.2vw,4.25rem)] leading-[1.12] sm:leading-[1.08] font-semibold tracking-[-0.025em] text-[#E8EEE8]"
            >
              <span className="block pb-1">Safe rides.</span>
              <span className="font-editorial block pb-1.5 font-normal italic text-[#E6C477]">
                Smarter teens.
              </span>
              <span className="block pb-1">Peaceful parents.</span>
            </h1>

            <div
              data-hero-copy
              className="pt-2 sm:pt-1 w-full min-w-0"
            >
              <p className="font-editorial text-[1rem] leading-snug italic text-[#E6C477] break-words sm:text-lg">
                Live route telemetry shared calmly with parents.
              </p>
            </div>

            <p
              data-hero-copy
              className="max-w-[46ch] text-[0.9375rem] leading-[1.6] font-normal text-[#D4E1D8] sm:text-lg"
            >
              Teen Cabs is a supervised mobility platform built exclusively for
              teens — uniting vetted drivers and live route visibility with an
              experience Gen Z genuinely enjoys.
            </p>

            <div
              data-hero-cta
              className="pt-2 sm:pt-1 flex flex-wrap items-center gap-3.5 sm:gap-5"
            >
              <button
                ref={ctaBtnRef}
                type="button"
                onClick={onOpenWaitlist}
                className="group/cta inline-flex min-h-[46px] shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#E6C477] px-6.5 py-3 text-sm font-semibold text-[#032A1D] shadow-lg shadow-black/25 transition-colors duration-150 hover:bg-[#D9B45B]"
              >
                <span>Get early access</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  aria-hidden="true"
                />
              </button>

              <a
                href="#the-need"
                className="inline-flex min-h-[46px] shrink-0 items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-medium text-[#E8EEE8] underline-offset-8 transition-colors duration-150 hover:text-[#E6C477] hover:underline"
              >
                <span>Discover Teen Cabs</span>
                <ArrowDown className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
              </a>
            </div>

            <div
              data-hero-cta
              className="pt-2 flex flex-wrap gap-x-6 gap-y-2.5 text-xs font-medium text-[#D4E1D8] sm:text-sm"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
                Parent-supervised trips
              </span>
              <span className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
                Verified drivers &amp; live GPS
              </span>
            </div>
          </div>

          {/* SCENE 02 — THE CONNECTED ROUTE (Progressive Map Entrance & Editorial Map Header) */}
          <div
            ref={mapRevealRef}
            className="lg:order-2 lg:col-span-6"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <div ref={stageVisualRef} className="relative">
              <div className="rounded-2xl border border-[#D8D9C9] bg-[#F3F0E6] p-3.5 text-[#063B27] shadow-2xl shadow-black/45 sm:rounded-3xl sm:p-6">
                {/* Refined Editorial Map Header */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[#D8D9C9] pb-2.5 sm:mb-3.5 sm:pb-3">
                  <span className="font-editorial text-[1.0625rem] leading-tight font-normal italic text-[#063B27] sm:text-[1.25rem]">
                    Live Route Preview
                  </span>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
                    <div
                      role="group"
                      aria-label="Switch app perspective"
                      className="relative inline-flex items-center gap-2.5 sm:gap-3"
                    >
                      {(
                        [
                          { id: 'parent', label: 'Parent view' },
                          { id: 'teen', label: 'Teen view' },
                        ] as const
                      ).map((mode) => {
                        const active = perspectiveMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              if (perspectiveMode === mode.id) return;
                              captureWidgetFlip();
                              setPerspectiveMode(mode.id);
                            }}
                            aria-pressed={active}
                            className={`relative min-h-[36px] cursor-pointer py-1.5 text-[11px] font-semibold transition-colors sm:min-h-[38px] sm:text-xs ${
                              active ? 'text-[#063B27]' : 'text-[#547064] hover:text-[#063B27]'
                            }`}
                          >
                            {mode.label}
                            {active && (
                              <span
                                data-flip-id="hero-perspective-line"
                                className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-[#E6C477]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAutoPlaying((prev) => !prev)}
                      aria-label={
                        isAutoPlaying
                          ? 'Pause live vehicle preview'
                          : 'Play live vehicle preview'
                      }
                      className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-2.5 py-1 text-[10px] font-mono tracking-wider text-[#063B27] uppercase transition-colors hover:border-[#D9B45B] sm:min-h-[36px] sm:px-3 sm:py-1.5 sm:text-[11px]"
                    >
                      {isAutoPlaying ? (
                        <>
                          <Pause className="h-3 w-3 text-[#E6C477]" aria-hidden="true" />
                          <span>Motion</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 text-[#E6C477]" aria-hidden="true" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <RouteMapCanvas
                  variant="hero"
                  activeStage={activeCheckpoint}
                  perspectiveMode={perspectiveMode}
                  isAutoPlaying={isAutoPlaying}
                />

                <div aria-live="polite" className="mt-3 px-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <div className="flex items-start gap-2.5 sm:items-center">
                      <span
                        className="relative mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center sm:mt-0"
                        aria-hidden="true"
                      >
                        <span className="animate-radar-ripple absolute inline-flex h-full w-full rounded-full bg-[#E6C477]" />
                        <MapPin className="relative h-3.5 w-3.5 text-[#063B27]" />
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${activeCheckpoint}-${perspectiveMode}`}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="text-xs font-medium text-[#063B27] sm:text-sm"
                        >
                          {perspectiveMode === 'parent'
                            ? routeProgress.parentStatus
                            : routeProgress.teenStatus}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="pl-6 font-mono text-xs tabular-nums text-[#547064] sm:pl-0">
                      {routeProgress.eta}
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-[#D8D9C9]"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D9B45B] to-[#E6C477] transition-all duration-500 ease-out"
                      style={{ width: `${routeProgress.progressPercent}%` }}
                    />
                  </div>

                  <div
                    role="group"
                    aria-label="Select live trip stage"
                    className="mt-3 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-5">
                      {(
                        [
                          { id: 'pickup', label: 'Pickup' },
                          { id: 'dropoff', label: 'Arrival' },
                        ] as const
                      ).map((stage) => {
                        const active = activeCheckpoint === stage.id;
                        return (
                          <button
                            key={stage.id}
                            type="button"
                            onClick={() => {
                              if (activeCheckpoint !== stage.id) {
                                captureWidgetFlip();
                                setActiveCheckpoint(stage.id);
                              }
                              setIsAutoPlaying(false);
                            }}
                            aria-pressed={active}
                            className={`relative min-h-[44px] cursor-pointer py-2 text-xs font-semibold transition-colors sm:min-h-[38px] sm:py-1.5 ${
                              active
                                ? 'text-[#063B27]'
                                : 'text-[#547064] hover:text-[#063B27]'
                            }`}
                          >
                            {stage.label}
                            {active && (
                              <span
                                data-flip-id="hero-stage-line"
                                className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-[#E6C477]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-[#547064]">
                      {routeProgress.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
