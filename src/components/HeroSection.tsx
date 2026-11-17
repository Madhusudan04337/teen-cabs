import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
import { RouteMapCanvas } from './RouteMapCanvas';

const HERO_LINE_STAGGER = 0.085;

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

const TYPING_ASSURANCES = [
  'Verified drivers screened for every ride.',
  'Live route telemetry shared calmly with parents.',
  'Built for teens who value effortless independence.',
  'Approved zones and predictable family ride limits.',
];

export function HeroSection({ onOpenWaitlist }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRevealRef = useRef<HTMLDivElement>(null);
  const stageVisualRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const tiltXToRef = useRef<((val: number) => void) | null>(null);
  const tiltYToRef = useRef<((val: number) => void) | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeCheckpoint, setActiveCheckpoint] = useState<RideStage>('pickup');
  const [perspectiveMode, setPerspectiveMode] = useState<'parent' | 'teen'>('parent');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(TYPING_ASSURANCES[0].length);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCharIndex(TYPING_ASSURANCES[0].length);
      return;
    }

    const currentPhrase = TYPING_ASSURANCES[phraseIndex];
    let delay = isDeleting ? 26 : 42;
    if (!isDeleting && charIndex === currentPhrase.length) delay = 2400;
    else if (isDeleting && charIndex === 0) delay = 360;

    const timer = window.setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setCharIndex((c) => c + 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex((c) => c - 1);
      } else {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % TYPING_ASSURANCES.length);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, prefersReducedMotion]);

  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveCheckpoint((prev) => STAGES[(STAGES.indexOf(prev) + 1) % STAGES.length]);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [isAutoPlaying, prefersReducedMotion]);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isMobile = window.innerWidth < 768;

        // Scene 01: Staggered Editorial Headline reveal with masked lines
        const headlineEls = gsap.utils.toArray<HTMLElement>('[data-hero-line]', root);
        if (headlineEls.length > 0) {
          gsap.fromTo(
            headlineEls,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: isMobile ? 0.75 : 0.85,
              delay: isMobile ? 0.08 : 0.2,
              stagger: HERO_LINE_STAGGER,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
            }
          );
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
          tiltXToRef.current = gsap.quickTo(stageVisualRef.current, 'rotateX', {
            duration: 0.5,
            ease: 'power3.out',
          });
          tiltYToRef.current = gsap.quickTo(stageVisualRef.current, 'rotateY', {
            duration: 0.5,
            ease: 'power3.out',
          });

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
        return () => detachMagnetic();
      });

      return () => {
        tiltXToRef.current = null;
        tiltYToRef.current = null;
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !tiltXToRef.current || !tiltYToRef.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    tiltYToRef.current(xRatio * 6);
    tiltXToRef.current(-yRatio * 4.5);
  };

  const handlePointerLeave = () => {
    tiltXToRef.current?.(0);
    tiltYToRef.current?.(0);
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

  const typedText = prefersReducedMotion
    ? TYPING_ASSURANCES[0]
    : TYPING_ASSURANCES[phraseIndex].slice(0, charIndex);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative z-10 overflow-hidden bg-[#032A1D] pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
    >
      {/* Restrained Ambient Lighting */}
      <div
        aria-hidden="true"
        className="animate-living-breath pointer-events-none absolute -top-24 right-0 h-[400px] w-[400px] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.08)_0%,transparent_66%)] sm:h-[620px] sm:w-[620px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-32 h-[360px] w-[360px] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(11,73,51,0.42)_0%,transparent_70%)]"
      />

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
              className="text-balance text-[clamp(2.125rem,4.2vw,4.25rem)] leading-[1.06] sm:leading-[1.04] font-semibold tracking-[-0.025em] text-[#E8EEE8]"
            >
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block">
                  Safe rides.
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span
                  data-hero-line
                  className="font-editorial block font-normal italic text-[#E6C477]"
                >
                  Smarter teens.
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block">
                  Peaceful parents.
                </span>
              </span>
            </h1>

            <div
              data-hero-copy
              className="pt-2 sm:pt-1 w-full min-w-0"
            >
              <p className="font-editorial text-[0.9375rem] leading-relaxed italic text-[#E6C477] whitespace-normal sm:text-lg">
                <span>{typedText}</span>
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
              <div className="rounded-3xl border border-[#D8D9C9] bg-[#F3F0E6] p-4 text-[#063B27] shadow-2xl shadow-black/45 sm:p-6">
                {/* Refined Editorial Map Header */}
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#D8D9C9] pb-3">
                  <span className="font-editorial text-[1.125rem] leading-tight font-normal italic text-[#063B27] sm:text-[1.25rem]">
                    Live Route Preview
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div
                      role="group"
                      aria-label="Switch app perspective"
                      className="relative inline-flex items-center gap-3"
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
                            onClick={() => setPerspectiveMode(mode.id)}
                            aria-pressed={active}
                            className={`relative min-h-[38px] cursor-pointer py-1.5 text-xs font-semibold transition-colors ${
                              active ? 'text-[#063B27]' : 'text-[#547064] hover:text-[#063B27]'
                            }`}
                          >
                            {mode.label}
                            {active && (
                              <motion.span
                                layoutId="hero-perspective-line"
                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
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
                      className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-3 py-1.5 text-[11px] font-mono tracking-wider text-[#063B27] uppercase transition-colors hover:border-[#D9B45B]"
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
                              setActiveCheckpoint(stage.id);
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
                              <motion.span
                                layoutId="hero-stage-underline"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
