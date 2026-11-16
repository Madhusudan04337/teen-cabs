import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
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
import { RouteMapCanvas } from './RouteMapCanvas';

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

  const parentStatusText = {
    pending: 'Awaiting parent approval',
    approved: 'Approved · En route to B',
    declined: 'Paused · Teen notified',
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

        <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-20 lg:space-y-24">
          {/* Flow 1: Safety & Trust — Editorial Narrative + Radial Biometric Shield Stage */}
          <article className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div data-exp-left className="lg:col-span-5">
              <p className="mb-2.5 text-sm font-medium tracking-wide text-[#D4E1D8]">
                Safety &amp; trust
              </p>
              <h3 className="text-2xl leading-[1.18] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                Every ride starts with trust.
              </h3>

              <div
                role="tablist"
                aria-label="Safety verification protocols"
                className="mt-6 inline-flex flex-wrap gap-6 border-b border-[#285640]"
              >
                {SAFETY_PROTOCOLS.map((protocol) => {
                  const selected = protocol.id === activeSafetyId;
                  return (
                    <button
                      key={protocol.id}
                      id={`safety-tab-${protocol.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="safety-tabpanel"
                      onClick={() => setActiveSafetyId(protocol.id)}
                      className={`relative min-h-[44px] cursor-pointer whitespace-nowrap py-2.5 text-xs font-semibold transition-colors sm:min-h-[40px] sm:py-2 sm:text-sm ${
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

              <div
                id="safety-tabpanel"
                role="tabpanel"
                aria-labelledby={`safety-tab-${activeSafetyId}`}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeSafety.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="mt-5 max-w-[44ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base"
                  >
                    {activeSafety.summary}
                  </motion.p>
                </AnimatePresence>

                <ul className="mt-5 space-y-3">
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

          {/* Flow 2: Parent Control — Shared RouteMapCanvas Parent Dashboard Card */}
          <article className="grid grid-cols-1 items-center gap-10 border-t border-[#285640] pt-14 sm:pt-16 lg:grid-cols-12 lg:gap-14">
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

                <RouteMapCanvas variant="dashboard" approvalState={approvalState} />

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
                            {parentStatusText}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setApprovalState('declined')}
                            className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#063B27] transition-colors hover:bg-[#E8EEE8] sm:min-h-[40px]"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setApprovalState('approved')}
                            className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full bg-[#063B27] px-5 py-2 text-xs font-semibold text-[#E6C477] transition-colors hover:bg-[#032A1D] sm:min-h-[40px]"
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
                            {parentStatusText}
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
                          className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#063B27] transition-colors hover:bg-[#E8EEE8] sm:min-h-[38px] sm:py-1.5"
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
              <p className="mt-4 max-w-[44ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
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

          {/* Flow 3: Made for Gen Z — Balanced Editorial Copy + Interactive Cabin Sound Stage */}
          <article className="grid grid-cols-1 items-center gap-10 border-t border-[#285640] pt-14 sm:pt-16 lg:grid-cols-12 lg:gap-14">
            <div data-exp-left className="lg:col-span-5">
              <p className="mb-2.5 text-sm font-medium tracking-wide text-[#D4E1D8]">
                Made for Gen Z
              </p>
              <h3 className="text-2xl leading-[1.18] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl lg:text-[2.125rem]">
                Your ride. Your vibe.
              </h3>
              <p className="mt-4 max-w-[44ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                Personalised cabin music presets and calm sensory profiles teens
                genuinely enjoy.
              </p>

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
                      id={`vibe-tab-${preset.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="vibe-tabpanel"
                      onClick={() => setActiveVibeId(preset.id)}
                      className={`relative min-h-[44px] cursor-pointer whitespace-nowrap py-2.5 text-xs font-semibold transition-colors sm:min-h-[40px] sm:py-2 sm:text-sm ${
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
            </div>

            <div data-exp-right className="lg:col-span-7">
              <div
                id="vibe-tabpanel"
                role="tabpanel"
                aria-labelledby={`vibe-tab-${activeVibeId}`}
                className="rounded-3xl border border-[#285640] bg-[#0B4933]/80 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
                    Active Cabin Preset
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAudioAnimating((prev) => !prev)}
                    aria-label={
                      isAudioAnimating ? 'Pause cabin equalizer' : 'Play cabin equalizer'
                    }
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full border border-[#285640] bg-[#032A1D] px-3.5 py-2 text-xs font-medium text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477] sm:min-h-[38px] sm:py-1.5"
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

                <div className="mt-6 flex flex-wrap items-center gap-7">
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
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeVibe.id}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-editorial text-2xl italic text-[#E8EEE8]">
                          {activeVibe.trackTitle}
                        </p>
                        <p className="mt-1 text-sm font-light text-[#D4E1D8]">
                          {activeVibe.cabinSetting}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <div aria-hidden="true" className="mt-5 flex h-9 items-end gap-1.5">
                      {activeVibe.bars.map((height, idx) => (
                        <span
                          key={idx}
                          className={`w-2 rounded-full bg-[#E6C477] transition-all duration-200 ${
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
              </div>
            </div>
          </article>

          {/* Flow 4: Compact Horizontal Editorial Closing Summary — Zero Empty Column Space */}
          <article
            data-exp-left
            className="flex flex-col justify-between gap-6 border-t border-[#285640] pt-10 lg:flex-row lg:items-center lg:gap-12"
          >
            <div>
              <p className="text-sm font-medium tracking-wide text-[#D4E1D8]">
                Smarter freedom
              </p>
              <h3 className="mt-1.5 text-2xl leading-[1.2] font-semibold tracking-[-0.015em] text-[#E8EEE8] sm:text-3xl">
                Freedom with{' '}
                <span className="font-editorial font-normal italic text-[#E6C477]">
                  thoughtful boundaries.
                </span>
              </h3>
            </div>
            <p className="max-w-[46ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
              Built so teens move confidently toward school, practice, and weekend
              activities while families enjoy clear oversight and calm predictability.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
