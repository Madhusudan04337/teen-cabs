import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  CarFront,
  Check,
  CheckCircle2,
  Disc3,
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
import {
  SAFETY_PROTOCOLS,
  VIBE_PRESETS,
} from '../data/teenCabsData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ExperienceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeSafetyId, setActiveSafetyId] = useState<'verified' | 'sos' | 'gps'>('verified');
  const [approvalState, setApprovalState] = useState<'pending' | 'approved' | 'declined'>('pending');
  const [activeVibeId, setActiveVibeId] = useState<'lofi' | 'study' | 'quiet'>('lofi');
  const [isAudioAnimating, setIsAudioAnimating] = useState(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 36 : 16;

        gsap.utils.toArray<HTMLElement>('[data-exp-left]').forEach((el) => {
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

        gsap.utils.toArray<HTMLElement>('[data-exp-right]').forEach((el) => {
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

        gsap.utils.toArray<HTMLElement>('[data-parallax-float]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 14 },
            {
              y: -14,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.35,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const activeSafety =
    SAFETY_PROTOCOLS.find((p) => p.id === activeSafetyId) ?? SAFETY_PROTOCOLS[0];
  const activeVibe =
    VIBE_PRESETS.find((v) => v.id === activeVibeId) ?? VIBE_PRESETS[0];

  const parentCarStage = {
    pending: { left: '34%', top: '49%', status: 'Awaiting parent approval' },
    approved: { left: '66%', top: '31%', status: 'Approved · En route to B' },
    declined: { left: '24%', top: '55%', status: 'Paused · Teen notified' },
  }[approvalState];

  const safetyVisualMeta = {
    verified: {
      title: 'Arjun K. · Teen-Certified Driver',
      subtitle: 'ID, license & pre-pickup selfie verified',
      metric: '99.8% Match',
      Icon: UserCheck,
    },
    sos: {
      title: '24/7 Guardian & Safety Desk',
      subtitle: 'Instant live audio & dispatch armed',
      metric: '< 3s Escalation',
      Icon: PhoneCall,
    },
    gps: {
      title: 'Locked Corridor Telemetry',
      subtitle: 'Sub-5s route adherence monitoring',
      metric: 'Live Telemetry',
      Icon: Radio,
    },
  }[activeSafetyId];

  const SafetyVisualIcon = safetyVisualMeta.Icon;

  return (
    <section
      id="features"
      ref={sectionRef}
      aria-labelledby="features-heading"
      className="relative z-10 border-t border-[#285640] bg-[#063B27] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
            The Teen Cabs experience
          </p>
          <h2
            id="features-heading"
            className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
          >
            More than a ride.
            <span className="font-editorial block font-normal italic text-[#E6C477]">
              A better way forward.
            </span>
          </h2>
        </div>

        <div className="mt-14 space-y-20 sm:mt-16 sm:space-y-24 lg:space-y-28">
          {/* Flow 1: Safety & Trust — Open Radial Biometric Shield & Telemetry Stage */}
          <article className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div data-exp-left className="lg:col-span-5">
              <p className="mb-2.5 text-sm font-medium tracking-wide text-[#D4E1D8]">
                Safety &amp; trust
              </p>
              <h3 className="text-2xl leading-[1.18] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                Every ride starts with trust.
              </h3>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSafety.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="mt-4 max-w-[44ch] rounded-2xl border border-[#285640] bg-[#0B4933] px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]"
                >
                  {activeSafety.summary}
                </motion.p>
              </AnimatePresence>

              <div
                role="tablist"
                aria-label="Safety verification protocols"
                className="mt-7 inline-flex flex-wrap gap-6 border-b border-[#285640]"
              >
                {SAFETY_PROTOCOLS.map((protocol) => {
                  const selected = protocol.id === activeSafetyId;
                  return (
                    <button
                      key={protocol.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveSafetyId(protocol.id)}
                      className={`relative min-h-[40px] cursor-pointer whitespace-nowrap py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        selected
                          ? 'text-[#E6C477]'
                          : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                      }`}
                    >
                      {protocol.label}
                      {selected && (
                        <motion.span
                          layoutId="safety-tab-line"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute right-0 -bottom-px left-0 h-[2px] bg-[#E6C477]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <ul className="mt-6 space-y-3">
                {activeSafety.checkpoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-sm leading-relaxed text-[#E8EEE8] sm:text-[0.9375rem]"
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-[#E6C477]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Open Sculpted Shield Beacon Stage */}
            <div data-exp-right className="lg:col-span-7">
              <div
                data-parallax-float
                className="relative flex flex-col items-center justify-center py-6 sm:py-8"
              >
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-[radial-gradient(circle,#0B4933_0%,rgba(6,59,39,0)_72%)] sm:h-72 sm:w-72">
                  <span
                    aria-hidden="true"
                    className="animate-radar-ripple absolute inset-6 rounded-full border border-[#E6C477]/45"
                  />
                  <span
                    aria-hidden="true"
                    className="animate-living-breath absolute inset-12 rounded-full border border-[#285640]"
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSafetyId}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.84 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.84 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#E6C477] text-[#032A1D] shadow-2xl shadow-black/35"
                    >
                      <SafetyVisualIcon className="h-10 w-10" aria-hidden="true" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeSafetyId}-caption`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.24 }}
                    className="mt-4 text-center"
                  >
                    <p className="font-mono text-xs font-semibold tracking-[0.12em] text-[#E6C477] uppercase">
                      {safetyVisualMeta.metric}
                    </p>
                    <p className="mt-1.5 text-lg font-medium text-[#E8EEE8] sm:text-xl">
                      {safetyVisualMeta.title}
                    </p>
                    <p className="mt-1 text-sm font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                      {safetyVisualMeta.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </article>

          {/* Flow 2: Parent Control — Warm Ivory Parent Dashboard Mini-Map Card */}
          <article className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div data-exp-left className="order-2 lg:order-1 lg:col-span-7">
              <div
                data-parallax-float
                className="rounded-3xl border border-[#D8D9C9] bg-[#F3F0E6] p-5 text-[#063B27] shadow-2xl shadow-black/45 sm:p-7"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#063B27]">
                    Parent dashboard
                  </p>
                  <span className="text-xs font-semibold text-[#547064]">
                    Connected
                  </span>
                </div>

                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#D8D9C9] bg-[#E8EEE8]">
                  <svg
                    viewBox="0 0 560 350"
                    className="h-full w-full"
                    role="img"
                    aria-label="Parent dashboard live street map showing route from pickup point A to destination point B with a mini cab"
                  >
                    <g stroke="#D8D9C9" strokeWidth="6" strokeLinecap="round" fill="none">
                      <path d="M-15 110 L215 190 L580 75" />
                      <path d="M-15 265 L270 205 L580 280" />
                      <path d="M95 -20 L135 370" />
                      <path d="M275 -20 L250 370" />
                      <path d="M445 -20 L405 370" />
                    </g>

                    <path
                      d="M 150 208 C 225 140, 325 100, 415 120"
                      fill="none"
                      stroke={approvalState === 'approved' ? '#063B27' : '#D9B45B'}
                      strokeWidth="4.5"
                      strokeDasharray="8 7"
                      strokeLinecap="round"
                      className="animate-route-dash"
                    />

                    {/* Pin A */}
                    <g transform="translate(150, 208)">
                      <circle r="24" fill="#063B27" fillOpacity="0.12" />
                      <circle r="14" fill="#063B27" stroke="#FFFFFF" strokeWidth="3" />
                      <text
                        y="4"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="Outfit, sans-serif"
                      >
                        A
                      </text>
                    </g>

                    {/* Pin B */}
                    <g transform="translate(415, 120)">
                      <circle r="24" fill="#D9B45B" fillOpacity="0.22" />
                      <circle r="14" fill="#E6C477" stroke="#FFFFFF" strokeWidth="3" />
                      <text
                        y="4"
                        textAnchor="middle"
                        fill="#032A1D"
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="Outfit, sans-serif"
                      >
                        B
                      </text>
                    </g>
                  </svg>

                  <motion.div
                    animate={{ left: parentCarStage.left, top: parentCarStage.top }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 150, damping: 20 }
                    }
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#063B27] text-[#E6C477] shadow-xl shadow-black/30 ring-2 ring-[#FFFFFF]">
                      <CarFront className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </motion.div>
                </div>

                <div aria-live="polite" className="mt-5 border-t border-[#D8D9C9] pt-4">
                  <AnimatePresence mode="wait">
                    {approvalState === 'pending' ? (
                      <motion.div
                        key="pending"
                        initial={prefersReducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                        className="flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs font-medium text-[#547064]">
                            Ride request · Oakridge High → City Library
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#063B27]">
                            {parentCarStage.status}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setApprovalState('declined')}
                            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#063B27] transition-colors hover:bg-[#E8EEE8]"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setApprovalState('approved')}
                            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[#063B27] px-5 py-2 text-xs font-semibold text-[#E6C477] transition-colors hover:bg-[#032A1D]"
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
                        className="flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs font-medium text-[#547064]">
                            {parentCarStage.status}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#063B27]">
                            {approvalState === 'approved'
                              ? 'Live GPS tracking started with verified driver Arjun K.'
                              : 'Rohan notified to select a parent-approved destination.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setApprovalState('pending')}
                          className="inline-flex min-h-[38px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-1.5 text-xs font-semibold text-[#063B27] transition-colors hover:bg-[#E8EEE8]"
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

            <div data-exp-right className="order-1 lg:order-2 lg:col-span-5">
              <p className="mb-2.5 text-sm font-medium tracking-wide text-[#D4E1D8]">
                Parent control
              </p>
              <h3 className="text-2xl leading-[1.18] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                Peace of mind, in real time.
              </h3>
              <p className="mt-4 max-w-[44ch] rounded-2xl border border-[#285640] bg-[#0B4933] px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                Approve rides in one tap, follow live map routes, and watch your
                teen’s verified cab glide safely from pickup to doorstep arrival.
              </p>

              <div className="mt-7 flex flex-wrap gap-6 text-sm text-[#D4E1D8]">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
                  Live route visibility
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
                  Instant parent sign-off
                </span>
              </div>
            </div>
          </article>

          {/* Flow 3 & 4: Gen Z Vibe + Smarter Freedom */}
          <div className="grid grid-cols-1 items-center gap-12 border-t border-[#285640] pt-14 sm:pt-16 lg:grid-cols-12 lg:gap-16">
            <article data-exp-left className="lg:col-span-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium tracking-wide text-[#D4E1D8]">
                  Made for Gen Z
                </p>
                <button
                  type="button"
                  onClick={() => setIsAudioAnimating((prev) => !prev)}
                  aria-label={
                    isAudioAnimating ? 'Pause cabin equalizer' : 'Play cabin equalizer'
                  }
                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-[#285640] bg-[#0B4933] px-3.5 py-1.5 text-xs font-medium text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477]"
                >
                  {isAudioAnimating ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-[#E6C477]" aria-hidden="true" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-[#E6C477]" aria-hidden="true" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="mt-2.5 text-2xl leading-[1.18] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                Your ride. Your vibe.
              </h3>
              <p className="mt-4 max-w-[44ch] rounded-2xl border border-[#285640] bg-[#0B4933] px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                Personalised cabin music presets and calm sensory profiles teens
                genuinely enjoy.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-7">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,#0B4933_0%,#032A1D_72%)] shadow-xl shadow-black/40">
                  <span
                    aria-hidden="true"
                    className="animate-living-breath absolute inset-2 rounded-full border border-[#D9B45B]/45"
                  />
                  <Disc3
                    className={`h-11 w-11 text-[#E6C477] ${
                      isAudioAnimating && activeVibe.id !== 'quiet'
                        ? 'animate-spin'
                        : ''
                    }`}
                    style={{ animationDuration: '7s' }}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-editorial text-xl italic text-[#E8EEE8]">
                    {activeVibe.trackTitle}
                  </p>
                  <p className="mt-1 text-xs text-[#B7C8BA]">
                    {activeVibe.cabinSetting}
                  </p>

                  <div aria-hidden="true" className="mt-4 flex h-8 items-end gap-1.5">
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
                </div>
              </div>

              <div
                role="tablist"
                aria-label="Teen ride cabin presets"
                className="mt-7 inline-flex flex-wrap gap-6 border-b border-[#285640]"
              >
                {VIBE_PRESETS.map((preset) => {
                  const selected = preset.id === activeVibeId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveVibeId(preset.id)}
                      className={`relative min-h-[40px] cursor-pointer whitespace-nowrap py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        selected
                          ? 'text-[#E6C477]'
                          : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                      }`}
                    >
                      {preset.label}
                      {selected && (
                        <motion.span
                          layoutId="vibe-tab-line"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute right-0 -bottom-px left-0 h-[2px] bg-[#E6C477]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </article>

            {/* Smarter Freedom Summary */}
            <article data-exp-right className="lg:col-span-6">
              <p className="text-sm font-medium tracking-wide text-[#D4E1D8]">
                Smarter freedom
              </p>
              <h3 className="mt-2.5 text-2xl leading-[1.18] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                Freedom with thoughtful boundaries.
              </h3>
              <p className="mt-4 max-w-[46ch] rounded-2xl border border-[#285640] bg-[#0B4933] px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                Set approved zones, travel hours, and weekly wallet limits cleanly
                in seconds.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
