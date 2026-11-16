import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroSectionProps {
  onOpenWaitlist: () => void;
}

const STAGES = ['pickup', 'enroute', 'dropoff'] as const;
type RideStage = (typeof STAGES)[number];

const TYPING_ASSURANCES = [
  'Verified drivers screened before every pickup.',
  'Live route telemetry shared calmly with parents.',
  'Built for teens who value effortless independence.',
  'Approved zones and predictable family ride limits.',
];

export function HeroSection({ onOpenWaitlist }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageVisualRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const tiltXToRef = useRef<((val: number) => void) | null>(null);
  const tiltYToRef = useRef<((val: number) => void) | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeCheckpoint, setActiveCheckpoint] = useState<RideStage>('enroute');
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
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-hero-line]', {
          yPercent: 100,
          opacity: 0,
          duration: 0.9,
          delay: 0.56,
          stagger: 0.09,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
        });

        gsap.from('[data-hero-fade]', {
          y: 16,
          opacity: 0,
          duration: 0.85,
          delay: 0.66,
          stagger: 0.06,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
        });

        if (stageVisualRef.current) {
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
            y: -22,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.35,
            },
          });
        }

        const btn = ctaBtnRef.current;
        if (btn && window.matchMedia('(pointer: fine)').matches) {
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });

          const onMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            xTo((e.clientX - (rect.left + rect.width / 2)) * 0.14);
            yTo((e.clientY - (rect.top + rect.height / 2)) * 0.18);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          btn.addEventListener('mousemove', onMove);
          btn.addEventListener('mouseleave', onLeave);
          return () => {
            btn.removeEventListener('mousemove', onMove);
            btn.removeEventListener('mouseleave', onLeave);
          };
        }
      });

      return () => {
        tiltXToRef.current = null;
        tiltYToRef.current = null;
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !tiltXToRef.current || !tiltYToRef.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    tiltYToRef.current(xRatio * 7);
    tiltXToRef.current(-yRatio * 5.5);
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
    enroute: {
      progressPercent: 64,
      eta: 'Arriving in 8 minutes',
      location: 'Parkview Safe Corridor',
      parentStatus: 'Live GPS corridor lock active across every mile',
      teenStatus: 'Smooth route via Parkview Ave — Cabin audio on',
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
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative z-10 overflow-hidden bg-[#032A1D] pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="animate-living-breath pointer-events-none absolute -top-24 right-0 h-[460px] w-[460px] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.09)_0%,transparent_66%)] sm:h-[620px] sm:w-[620px]"
      />

      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p
              data-hero-fade
              className="mb-3.5 text-sm font-medium tracking-wide text-[#D4E1D8]"
            >
              A safer way to move forward
            </p>

            <h1
              id="hero-heading"
              className="text-balance text-[clamp(2.5rem,4.7vw,4.25rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-[#E8EEE8]"
            >
              <span className="block overflow-hidden pb-0.5">
                <span data-hero-line className="block">
                  Safe rides.
                </span>
              </span>
              <span className="block overflow-hidden pb-0.5">
                <span
                  data-hero-line
                  className="font-editorial block font-normal italic text-[#E6C477]"
                >
                  Smarter teens.
                </span>
              </span>
              <span className="block overflow-hidden pb-0.5">
                <span data-hero-line className="block">
                  Peaceful parents.
                </span>
              </span>
            </h1>

            <div
              data-hero-fade
              className="mt-6 flex min-h-[2.75rem] items-center sm:min-h-[1.85rem]"
            >
              <p className="font-editorial text-base leading-snug italic text-[#E6C477] sm:text-lg">
                <span>{typedText}</span>
                {!prefersReducedMotion && (
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-[#E6C477] align-middle"
                  />
                )}
              </p>
            </div>

            <p
              data-hero-fade
              className="mt-4 max-w-[46ch] text-base leading-[1.65] font-light text-[#D4E1D8] sm:text-[1.0625rem]"
            >
              Teen Cabs is a supervised mobility platform built exclusively for
              teens — uniting vetted drivers and live route visibility with an
              experience Gen Z genuinely enjoys.
            </p>

            <div
              data-hero-fade
              className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <button
                ref={ctaBtnRef}
                type="button"
                onClick={onOpenWaitlist}
                className="group/cta inline-flex min-h-[48px] shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#E6C477] px-7 py-3 text-sm font-semibold text-[#032A1D] shadow-lg shadow-black/25 transition-colors duration-150 hover:bg-[#D9B45B]"
              >
                <span>Get early access</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  aria-hidden="true"
                />
              </button>

              <a
                href="#the-need"
                className="inline-flex min-h-[48px] shrink-0 items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-medium text-[#E8EEE8] underline-offset-8 transition-colors duration-150 hover:text-[#E6C477] hover:underline"
              >
                <span>Discover Teen Cabs</span>
                <ArrowDown className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
              </a>
            </div>

            <div
              data-hero-fade
              className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#D4E1D8]"
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

          {/* Right Column */}
          <div
            data-hero-fade
            className="lg:col-span-6"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <div ref={stageVisualRef} className="relative">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label="Switch app perspective"
                  className="relative inline-flex items-center gap-4"
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
                        className={`relative min-h-[44px] cursor-pointer py-2 text-xs font-semibold transition-colors sm:min-h-[38px] sm:py-1.5 ${
                          active ? 'text-[#E6C477]' : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
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
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full border border-[#285640] bg-[#0B4933] px-3.5 py-2 text-xs font-medium text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477] sm:min-h-[38px] sm:py-1.5"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-[#E6C477]" aria-hidden="true" />
                      <span>Live motion</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-[#E6C477]" aria-hidden="true" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>

              <RouteMapCanvas
                variant="hero"
                activeStage={activeCheckpoint}
                perspectiveMode={perspectiveMode}
                isAutoPlaying={isAutoPlaying}
              />

              <div aria-live="polite" className="mt-2 px-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="animate-radar-ripple absolute inline-flex h-full w-full rounded-full bg-[#E6C477]" />
                      <MapPin className="relative h-3.5 w-3.5 text-[#E6C477]" />
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${activeCheckpoint}-${perspectiveMode}`}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="text-xs font-medium text-[#E8EEE8] sm:text-sm"
                      >
                        {perspectiveMode === 'parent'
                          ? routeProgress.parentStatus
                          : routeProgress.teenStatus}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#E6C477]">
                    {routeProgress.eta}
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-[#285640]"
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
                        { id: 'enroute', label: 'En route' },
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
                              ? 'text-[#E6C477]'
                              : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
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
                  <span className="text-xs text-[#B7C8BA]">
                    {routeProgress.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
