import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Pause,
  PhoneCall,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import verifiedDriverImg from '../assets/images/features_verified_driver_clean_1794994233919.jpg';
import calmCabinImg from '../assets/images/features_calm_cabin_1794994192851.jpg';
import { SAFETY_PROTOCOLS, VIBE_PRESETS } from '../data/teenCabsData';
import { useLenis } from '../motion/LenisContext';
import { gsap, useGSAP } from '../motion/setup';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
} from '../motion/tokens';
import { RouteMapCanvas } from './RouteMapCanvas';

const SAFETY_METRICS = {
  verified: {
    metric: 'Pre-pickup verified',
    badgeTitle: 'Driver Verification Preview',
    badgeSubtitle: 'Sample badge · ID, license & pre-pickup selfie verified',
    Icon: UserCheck,
  },
  sos: {
    metric: '24/7 Safety Desk',
    badgeTitle: 'Round-the-clock Safety Desk',
    badgeSubtitle: 'Guardian alert & live dispatch support',
    Icon: PhoneCall,
  },
  gps: {
    metric: 'Sub-5s GPS refresh',
    badgeTitle: 'Continuous Corridor Tracking',
    badgeSubtitle: 'Detour & stop anomaly alerts',
    Icon: Radio,
  },
} as const;

const STORY_CHAPTERS = [
  {
    id: 'feature-panel-safety',
    chapter: '01',
    label: 'Safety & trust',
    summary: 'Multi-stage driver vetting, SOS escalation, and live corridor telemetry.',
  },
  {
    id: 'feature-panel-control',
    chapter: '02',
    label: 'Parent control',
    summary: 'One-tap ride approval paired with a live family route monitor.',
  },
  {
    id: 'feature-panel-genz',
    chapter: '03',
    label: 'Made for Gen Z',
    summary: 'Personalised cabin music presets and calm sensory ride profiles.',
  },
] as const;

function getNavbarHeight(): number {
  const header = document.querySelector('header');
  if (!header) return 69;
  const height = Math.round(header.getBoundingClientRect().height);
  return height > 0 ? height : 69;
}

export function ExperienceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion, scrollTo } = useLenis();

  const [approvalState, setApprovalState] = useState<'pending' | 'approved' | 'declined'>('pending');
  const [activeVibeId, setActiveVibeId] = useState<'lofi' | 'study' | 'quiet'>('lofi');
  const [isAudioAnimating, setIsAudioAnimating] = useState(true);

  const scrollToChapter = useCallback(
    (elementId: string) => {
      const targetEl = document.getElementById(elementId);
      if (!targetEl) return;

      scrollTo(targetEl, {
        offset: -(getNavbarHeight() + 8),
        immediate: prefersReducedMotion,
        duration: MOTION_DURATION.reveal,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
    },
    [prefersReducedMotion, scrollTo]
  );

  // Clean non-pinned vertical ScrollTrigger reveals for natural Apple-style narrative scroll
  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offsetX = isDesktop ? MOTION_DISTANCE.desktopX : MOTION_DISTANCE.mobileX;
        const offsetY = isDesktop ? MOTION_DISTANCE.desktopY : MOTION_DISTANCE.mobileY;

        const panelElements = gsap.utils.toArray<HTMLElement>('[data-story-panel]', root);
        panelElements.forEach((panel) => {
          const copyLayer = panel.querySelector<HTMLElement>('[data-panel-copy]');
          const visualLayer = panel.querySelector<HTMLElement>('[data-panel-visual]');

          if (copyLayer) {
            gsap.fromTo(
              copyLayer,
              {
                x: isDesktop ? -offsetX : 0,
                y: isDesktop ? 0 : offsetY,
                opacity: 0,
              },
              {
                x: 0,
                y: 0,
                opacity: 1,
                duration: MOTION_DURATION.reveal,
                ease: MOTION_EASE.editorial,
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 86%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              }
            );
          }

          if (visualLayer) {
            gsap.fromTo(
              visualLayer,
              {
                x: isDesktop ? offsetX : 0,
                y: offsetY * 0.75,
                opacity: 0,
              },
              {
                x: 0,
                y: 0,
                opacity: 1,
                duration: MOTION_DURATION.reveal,
                delay: 0.08,
                ease: MOTION_EASE.editorial,
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 86%',
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

  const activeVibe =
    VIBE_PRESETS.find((v) => v.id === activeVibeId) ?? VIBE_PRESETS[0];

  const parentStatusText = {
    pending: 'Awaiting parent approval',
    approved: 'Sample approved · En route to B',
    declined: 'Sample paused · Teen notified',
  }[approvalState];

  const primaryDriverProtocol = SAFETY_PROTOCOLS[0];
  const secondarySafetyProtocols = SAFETY_PROTOCOLS.slice(1);

  return (
    <section
      id="features"
      ref={sectionRef}
      aria-labelledby="features-heading"
      className="relative z-10 overflow-x-clip bg-[#063B27]"
    >
      {/* Editorial Narrative Opener */}
      <div className="border-b border-[#285640] bg-[#032A1D] py-14 sm:py-18 lg:py-20">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 px-6 sm:px-8 lg:flex-row lg:items-end lg:px-10">
          <div className="max-w-[38rem]">
            <p className="text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm">
              The Teen Cabs experience
            </p>
            <h1
              id="features-heading"
              className="mt-2 text-balance text-3xl leading-[1.1] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[3.25rem]"
            >
              More than a ride.{' '}
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                A better way forward.
              </span>
            </h1>
          </div>

          <p className="max-w-[42ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
            Multi-stage driver vetting, live parent visibility, and calm cabin
            personalisation — designed together so every school commute feels
            predictable and effortless.
          </p>
        </div>
      </div>

      {/* Continuous Vertical Scroll Narrative */}
      <div className="divide-y divide-[#285640]">
        {/* SECTION 1 (SAFETY): Clean side-by-side driver verification details and badge */}
        <article
          id="feature-panel-safety"
          data-story-panel
          aria-labelledby="panel-safety-title"
          className="relative bg-[#063B27] py-16 sm:py-22 lg:py-28"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_70%_at_74%_50%,rgba(11,73,51,0.72),transparent_72%)]"
          />

          <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
            {/* Left Narrative Column: All Safety Pillars Open in Scroll Flow */}
            <div data-panel-copy className="lg:col-span-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm">
                <span className="font-mono text-[#E6C477] tabular-nums">01</span>
                <span aria-hidden="true">·</span>
                <span>Safety &amp; trust</span>
              </div>

              <h2
                id="panel-safety-title"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[2.5rem]"
              >
                Every ride starts with{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  trust.
                </span>
              </h2>

              <p className="mt-4 max-w-[44ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                {primaryDriverProtocol.summary}
              </p>

              {/* Open Safeguards Summary List */}
              <div className="mt-8 space-y-6">
                {secondarySafetyProtocols.map((protocol) => {
                  const meta = SAFETY_METRICS[protocol.id];
                  const Icon = meta.Icon;
                  return (
                    <div key={protocol.id}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className="h-4 w-4 shrink-0 text-[#E6C477]"
                            aria-hidden="true"
                          />
                          <h3 className="text-base font-semibold text-[#E8EEE8]">
                            {protocol.heading}
                          </h3>
                        </div>
                        <span className="font-mono text-xs font-medium text-[#E6C477] tabular-nums">
                          {meta.metric}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-[1.65] font-light text-[#D4E1D8]">
                        {protocol.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Visual Stage: Verified Driver Photography & Verification Summary */}
            <div data-panel-visual className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-[#285640] bg-[#032A1D] shadow-2xl shadow-black/35">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Side A: Authentic Uniformed Chauffeur Portrait */}
                  <div className="relative md:col-span-6">
                    <img
                      src={verifiedDriverImg}
                      alt="Uniformed verified driver holding open the rear passenger door of a clean silver sedan on a sunlit Chennai residential street"
                      loading="lazy"
                      className="aspect-[4/3] h-full w-full object-cover object-top md:aspect-auto"
                    />
                  </div>

                  {/* Side B: Clean Solid Verification Checklist */}
                  <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-base font-semibold text-[#F3F0E6]">
                          {primaryDriverProtocol.heading}
                        </p>
                        <span className="font-mono text-xs font-medium text-[#E6C477]">
                          {SAFETY_METRICS.verified.metric}
                        </span>
                      </div>

                      <ul className="mt-5 space-y-3.5">
                        {primaryDriverProtocol.checkpoints.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-[#E8EEE8]"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-[#E6C477]"
                              aria-hidden="true"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-4 border-t border-[#285640] pt-5">
                      <div>
                        <p className="text-xs font-medium text-[#B7C8BA]">
                          SOS support
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-[#F3F0E6] tabular-nums sm:text-sm">
                          {SAFETY_METRICS.sos.metric}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#B7C8BA]">
                          Live GPS
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-[#F3F0E6] tabular-nums sm:text-sm">
                          {SAFETY_METRICS.gps.metric}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SECTION 2 (PARENT CONTROL): Visual mockup showcasing parent dashboard & route tracker */}
        <article
          id="feature-panel-control"
          data-story-panel
          aria-labelledby="panel-control-title"
          className="relative bg-[#032A1D] py-16 sm:py-22 lg:py-28"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_30%_52%,rgba(11,73,51,0.55),transparent_72%)]"
          />

          <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
            {/* Left Visual Mockup: Parent Dashboard & Route Tracker */}
            <div
              data-panel-visual
              className="order-2 flex justify-center lg:order-1 lg:col-span-7 lg:justify-start"
            >
              <div className="w-full max-w-[580px] rounded-2xl bg-[#F3F0E6] p-4 text-[#063B27] shadow-2xl shadow-black/35 sm:rounded-3xl sm:p-7">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#063B27]">
                    Parent dashboard
                  </p>
                  <span className="text-xs font-semibold text-[#547064]">
                    Interactive preview
                  </span>
                </div>

                <RouteMapCanvas
                  variant="dashboard"
                  approvalState={approvalState}
                />

                <div aria-live="polite" className="mt-5 pt-1">
                  <AnimatePresence mode="wait">
                    {approvalState === 'pending' ? (
                      <motion.div
                        key="pending"
                        initial={prefersReducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                        className="flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-medium text-[#547064]">
                            Sample request · Oakridge High → City Library
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#063B27]">
                            {parentStatusText}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setApprovalState('declined')}
                            className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#063B27] transition-colors hover:bg-[#E8EEE8] sm:min-h-[40px]"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setApprovalState('approved')}
                            className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#063B27] px-5 py-2 text-xs font-semibold text-[#E6C477] transition-colors hover:bg-[#032A1D] sm:min-h-[40px]"
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Approve ride</span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="resolved"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                        className="flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs font-medium text-[#547064]">
                            {parentStatusText}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#063B27]">
                            {approvalState === 'approved'
                              ? 'Sample live tracking active along verified corridor A → B.'
                              : 'Sample alert sent to select a parent-approved destination.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setApprovalState('pending')}
                          className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#063B27] transition-colors hover:bg-[#E8EEE8] sm:min-h-[40px]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Reset demo</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Narrative Column */}
            <div data-panel-copy className="order-1 lg:order-2 lg:col-span-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm">
                <span className="font-mono text-[#E6C477] tabular-nums">02</span>
                <span aria-hidden="true">·</span>
                <span>Parent control</span>
              </div>

              <h2
                id="panel-control-title"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[2.5rem]"
              >
                Peace of mind,{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  in real time.
                </span>
              </h2>

              <p className="mt-4 max-w-[44ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                Approve rides in one tap, follow live map routes, and watch your
                teen’s verified cab glide safely from pickup to doorstep arrival.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E6C477]" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#E8EEE8]">
                      Live route visibility
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed font-light text-[#D4E1D8]">
                      Follow pickup through drop-off along a live route monitor.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E6C477]" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#E8EEE8]">
                      Instant parent sign-off
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed font-light text-[#D4E1D8]">
                      Approve or pause ride requests in one tap before pickup begins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SECTION 3 (GEN Z VIBE): Sleek preview of music presets and audio preferences */}
        <article
          id="feature-panel-genz"
          data-story-panel
          aria-labelledby="panel-genz-title"
          className="relative bg-[#063B27] py-16 sm:py-22 lg:py-28"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(230,196,119,0.08),transparent_60%)]"
          />

          <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
            {/* Left Column: All 3 Music Presets & Audio Preferences Openly Displayed */}
            <div data-panel-copy className="lg:col-span-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm">
                <span className="font-mono text-[#E6C477] tabular-nums">03</span>
                <span aria-hidden="true">·</span>
                <span>Made for Gen Z</span>
              </div>

              <h2
                id="panel-genz-title"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[2.5rem]"
              >
                Your ride.{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  Your vibe.
                </span>
              </h2>

              <p className="mt-4 max-w-[44ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                Personalised cabin music presets and calm sensory profiles teens
                genuinely enjoy.
              </p>

              {/* Open Borderless Preset Selector Rows */}
              <div
                aria-label="Available teen cabin audio preferences"
                className="mt-8 space-y-2"
              >
                {VIBE_PRESETS.map((preset) => {
                  const selected = preset.id === activeVibeId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActiveVibeId(preset.id)}
                      aria-pressed={selected}
                      className={`group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200 ${
                        selected
                          ? 'bg-[#E8EEE8]/[0.08] backdrop-blur-xs'
                          : 'hover:bg-[#E8EEE8]/[0.04]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#E6C477]">
                          {preset.label}
                        </p>
                        <p className="mt-0.5 font-editorial text-lg italic text-[#F3F0E6]">
                          {preset.trackTitle}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed font-light text-[#D4E1D8]">
                          {preset.cabinSetting}
                        </p>
                      </div>

                      {/* Mini Waveform Signature */}
                      <div
                        aria-hidden="true"
                        className="flex h-7 shrink-0 items-end gap-1"
                      >
                        {preset.bars.slice(0, 5).map((bar, idx) => (
                          <span
                            key={idx}
                            className={`w-1 rounded-full transition-colors ${
                              selected ? 'bg-[#E6C477]' : 'bg-[#B7C8BA]/50 group-hover:bg-[#E6C477]/75'
                            }`}
                            style={{ height: `${Math.max(24, bar)}%` }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Visual Stage: Editorial Cabin Photography & Audio Preference Bar */}
            <div data-panel-visual className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-[#285640] bg-[#032A1D] shadow-2xl shadow-black/35">
                <img
                  src={calmCabinImg}
                  alt="Teenager seated comfortably in a clean cab backseat wearing headphones and looking out at sunlit trees"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/10]"
                />

                <div className="border-t border-[#285640] p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#D4E1D8]">
                        <span className="font-mono text-[#E6C477]">Cabin preview</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeVibe.label}</span>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeVibe.id}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2"
                        >
                          <p className="font-editorial text-xl italic text-[#E8EEE8] sm:text-2xl">
                            {activeVibe.trackTitle}
                          </p>
                          <p className="mt-1 text-xs font-light text-[#D4E1D8] sm:text-sm">
                            {activeVibe.cabinSetting}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        aria-hidden="true"
                        className="flex h-9 items-end gap-1.5"
                      >
                        {activeVibe.bars.map((height, idx) => (
                          <span
                            key={idx}
                            className={`w-1.5 rounded-full bg-[#E6C477] transition-all duration-200 ${
                              isAudioAnimating && activeVibe.id !== 'quiet'
                                ? 'animate-wave-bar'
                                : ''
                            }`}
                            style={{
                              height: `${height}%`,
                              opacity: 0.45 + (idx % 3) * 0.22,
                              animationDelay: `${idx * 110}ms`,
                            }}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAudioAnimating((prev) => !prev)}
                        aria-label={
                          isAudioAnimating
                            ? 'Pause cabin equalizer'
                            : 'Play cabin equalizer'
                        }
                        className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#285640] bg-[#063B27] px-4 py-2 text-xs font-medium text-[#D4E1D8] transition-colors hover:border-[#E6C477]/60 hover:text-[#E6C477] sm:min-h-[40px]"
                      >
                        {isAudioAnimating ? (
                          <>
                            <Pause
                              className="h-3.5 w-3.5 text-[#E6C477]"
                              aria-hidden="true"
                            />
                            <span>Playing</span>
                          </>
                        ) : (
                          <>
                            <Play
                              className="h-3.5 w-3.5 text-[#E6C477]"
                              aria-hidden="true"
                            />
                            <span>Paused</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SECTION 4 (SMARTER FREEDOM): Calm Editorial Summary & Next Step */}
        <article
          id="feature-panel-freedom"
          data-story-panel
          aria-labelledby="panel-freedom-title"
          className="relative bg-[#032A1D] py-16 sm:py-22 lg:py-28"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_65%_at_25%_45%,rgba(11,73,51,0.58),transparent_72%)]"
          />

          <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-6 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-10">
            <div data-panel-copy className="lg:col-span-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm">
                <span className="font-mono text-[#E6C477] tabular-nums">04</span>
                <span aria-hidden="true">·</span>
                <span>Smarter freedom</span>
              </div>
              <h2
                id="panel-freedom-title"
                className="text-balance text-3xl leading-[1.15] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[2.625rem]"
              >
                Freedom with{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  thoughtful boundaries.
                </span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                Built so teens move confidently toward school, practice, and weekend
                activities while families enjoy clear oversight and calm predictability.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  to="/how-it-works"
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#E6C477] px-6 py-2.5 text-sm font-semibold text-[#032A1D] transition-colors duration-200 hover:bg-[#D9B45B]"
                >
                  <span>See how a trip unfolds</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div data-panel-visual className="lg:col-span-6">
              <div className="divide-y divide-[#285640] border-y border-[#285640]">
                {STORY_CHAPTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToChapter(item.id)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left transition-colors duration-200 hover:bg-[#0B4933]/35 sm:px-3"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 font-mono text-xs font-semibold text-[#E6C477] tabular-nums">
                        {item.chapter}
                      </span>
                      <div>
                        <p className="text-base font-semibold text-[#E8EEE8] transition-colors group-hover:text-[#E6C477]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-light text-[#D4E1D8]">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-[#B7C8BA] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#E6C477]"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
