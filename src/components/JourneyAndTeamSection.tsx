import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Link2,
  Navigation,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { JOURNEY_STEPS, TEAM_MEMBERS, type TeamMember } from '../data/teenCabsData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEP_ICONS = [UserPlus, Link2, Navigation, ShieldCheck] as const;

function EditorialPortraitFrame({
  member,
  className = 'aspect-[4/4.6]',
}: {
  member: TeamMember;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member.id, member.portraitSrc]);

  const showPhoto = Boolean(member.portraitSrc) && !imgError;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.75rem] border border-[#285640] bg-gradient-to-b from-[#0B4933] via-[#063B27] to-[#032A1D] shadow-2xl shadow-black/45 ${className}`}
    >
      {showPhoto ? (
        <>
          <img
            src={member.portraitSrc}
            alt={`${member.name}, ${member.role} at Forgeit and Teen Cabs`}
            onError={() => setImgError(true)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#032A1D]/90 via-[#032A1D]/20 to-transparent"
          />
        </>
      ) : (
        <>
          {/* Subtle Ambient Gold Rim Light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 left-1/2 h-64 w-64 -translate-x-1/2 transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.18)_0%,transparent_66%)]"
          />

          {/* Sculpted Editorial Bust Silhouette Fallback */}
          <svg viewBox="0 0 240 270" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id={`editorial-sil-${member.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E6C477" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#D9B45B" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#032A1D" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            <circle
              cx="120"
              cy="112"
              r="76"
              fill="none"
              stroke="#E6C477"
              strokeOpacity="0.22"
              strokeWidth="1.2"
              strokeDasharray="5 7"
            />

            <circle
              cx="120"
              cy="98"
              r="34"
              fill={`url(#editorial-sil-${member.id})`}
              stroke="#E6C477"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <path
              d="M44 270 C 44 196, 76 160, 120 160 C 164 160, 196 196, 196 270 Z"
              fill={`url(#editorial-sil-${member.id})`}
              stroke="#E6C477"
              strokeOpacity="0.42"
              strokeWidth="1.5"
            />
          </svg>
        </>
      )}

      {/* Clean Editorial Role & Initials Overlay */}
      <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
            {member.role}
          </p>
          <p className="font-sans mt-0.5 text-2xl font-semibold tracking-tight text-[#E8EEE8]">
            {member.name}
          </p>
        </div>
        <span className="font-editorial flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#285640] bg-[#032A1D]/90 text-sm italic text-[#E6C477] backdrop-blur-sm">
          {member.initials}
        </span>
      </div>
    </div>
  );
}

export function JourneyAndTeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const founder = TEAM_MEMBERS[0];
  const leadershipPair = [TEAM_MEMBERS[1], TEAM_MEMBERS[2]];
  const tier3Team = [TEAM_MEMBERS[3], TEAM_MEMBERS[4], TEAM_MEMBERS[5]];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 36 : 16;

        // Progressive dashed route drawing on How It Works
        if (routePathRef.current) {
          const length = routePathRef.current.getTotalLength();
          gsap.set(routePathRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(routePathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#how-it-works',
              start: 'top 80%',
              end: 'center 42%',
              scrub: 0.3,
            },
          });
        }

        // Smooth reversible node cascade
        gsap.fromTo(
          '[data-journey-node]',
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.09,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '#how-it-works',
              start: 'top 86%',
              end: 'bottom 4%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Team tiered reveal animations
        gsap.utils.toArray<HTMLElement>('[data-team-card]').forEach((el, idx) => {
          gsap.fromTo(
            el,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              delay: idx * 0.07,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: '#team',
                start: 'top 85%',
                end: 'bottom 4%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative z-10">
      {/* Section 5: How It Works */}
      <section
        id="how-it-works"
        aria-labelledby="journey-heading"
        className="border-t border-[#285640] bg-[#032A1D] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
                How it works
              </p>
              <h2
                id="journey-heading"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
              >
                Simple steps.
                <span className="font-editorial block font-normal italic text-[#E6C477]">
                  Safer journeys.
                </span>
              </h2>
            </div>

            <p className="max-w-[38ch] text-base leading-[1.65] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
              From family sign-up to verified drop-off in four calm steps.
            </p>
          </div>

          <div className="relative mt-14 sm:mt-16">
            {/* Desktop Horizontal Connecting SVG Route Line aligned through all four icon centers */}
            <svg
              viewBox="0 0 1120 64"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-0 hidden h-16 w-full lg:block"
            >
              <path
                d="M 32 32 Q 177 8, 322 32 T 612 32 T 902 32"
                stroke="#285640"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                ref={routePathRef}
                d="M 32 32 Q 177 8, 322 32 T 612 32 T 902 32"
                stroke="#E6C477"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Mobile Vertical Connecting Line */}
            <div
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-7 w-px bg-[#285640] lg:hidden"
            />

            <ol className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-10">
              {JOURNEY_STEPS.map((item, idx) => {
                const Icon = STEP_ICONS[idx];
                const isHighlighted = idx === activeStepIndex;
                const stepNum = `0${idx + 1}`;
                return (
                  <li key={item.id} data-journey-node className="relative pl-18 lg:pl-0">
                    <button
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      aria-current={isHighlighted ? 'step' : undefined}
                      className="group flex w-full cursor-pointer flex-col items-start text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 max-lg:absolute max-lg:top-0 max-lg:left-0 lg:h-16 lg:w-16 ${
                            isHighlighted
                              ? 'bg-[#E6C477] text-[#032A1D] shadow-xl shadow-black/25'
                              : 'border border-[#285640] bg-[#0B4933] text-[#E6C477] group-hover:border-[#D9B45B]'
                          }`}
                        >
                          {isHighlighted && (
                            <span
                              aria-hidden="true"
                              className="animate-radar-ripple absolute inset-0 rounded-full ring-2 ring-[#E6C477]"
                            />
                          )}
                          <Icon className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 lg:mt-6">
                        <span
                          className={`font-mono text-xs font-semibold tracking-wider ${
                            isHighlighted ? 'text-[#E6C477]' : 'text-[#B7C8BA]'
                          }`}
                        >
                          STEP {stepNum}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`h-px w-8 transition-colors ${
                            isHighlighted ? 'bg-[#E6C477]' : 'bg-[#285640]'
                          }`}
                        />
                      </div>

                      <h3
                        className={`mt-2 text-lg leading-snug font-semibold transition-colors sm:text-xl ${
                          isHighlighted
                            ? 'text-[#E6C477]'
                            : 'text-[#E8EEE8] group-hover:text-[#E6C477]'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-[1.68] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                        {item.description}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Section 6: Leadership & Craft Team Section */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="border-t border-[#285640] bg-[#063B27] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center pb-12 sm:pb-16">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
              Our leadership
            </p>
            <h2
              id="team-heading"
              className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
            >
              Leadership &amp;
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                Craft.
              </span>
            </h2>
            <p className="mt-4 text-base font-light text-[#D4E1D8] sm:text-[1.0625rem]">
              The experienced minds and designers building Forgeit and Teen Cabs.
            </p>
          </div>

          {/* Tier 1: Prominent Centered Founder Profile Card at Top */}
          <div className="mx-auto max-w-4xl pb-10 sm:pb-14">
            <div
              data-team-card
              className="group relative overflow-hidden rounded-[2.5rem] border border-[#285640] bg-[#0B4933]/90 p-6 shadow-2xl shadow-black/45 backdrop-blur-md transition-all duration-300 hover:border-[#D9B45B]/60 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-0 h-72 w-72 transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.14)_0%,transparent_70%)]"
              />

              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                  <div className="w-full overflow-hidden rounded-2xl border border-[#285640] bg-[#032A1D]">
                    <EditorialPortraitFrame member={founder} className="aspect-[4/4.2]" />
                  </div>
                </div>

                <div className="md:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#285640] bg-[#032A1D] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#E6C477] uppercase font-sans">
                    <span>Founder Spotlight</span>
                  </div>

                  <h3 className="font-sans mt-3 text-3xl font-semibold tracking-tight text-[#E8EEE8] sm:text-4xl">
                    {founder.name}
                  </h3>
                  <p className="font-sans mt-1 text-xs font-bold tracking-[0.14em] text-[#E6C477] uppercase">
                    {founder.role}
                  </p>
                  <p className="mt-1.5 font-mono text-xs text-[#B7C8BA]">
                    {founder.focusArea}
                  </p>

                  <p className="mt-4 text-sm leading-[1.7] font-normal text-[#D4E1D8] sm:text-base">
                    {founder.bio}
                  </p>

                  <blockquote className="mt-5 border-t border-[#285640] pt-4">
                    <p className="font-editorial text-base italic text-[#E6C477] sm:text-lg">
                      “{founder.quote}”
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          {/* Tier 2: Balanced Two-Column Row for Leadership Pair */}
          <div className="mx-auto max-w-5xl pb-10 sm:pb-14">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {leadershipPair.map((member) => (
                <div
                  key={member.id}
                  data-team-card
                  className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#285640] bg-[#0B4933]/80 p-6 shadow-xl shadow-black/35 backdrop-blur-md transition-all duration-300 hover:border-[#D9B45B]/50 sm:p-8"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-6 w-full overflow-hidden rounded-2xl border border-[#285640] bg-[#032A1D]">
                        <EditorialPortraitFrame member={member} className="aspect-[4/4]" />
                      </div>

                      <h3 className="font-sans text-2xl font-semibold tracking-tight text-[#E8EEE8] sm:text-3xl">
                        {member.name}
                      </h3>
                      <p className="font-sans mt-1 text-xs font-bold tracking-[0.14em] text-[#E6C477] uppercase">
                        {member.role}
                      </p>
                      <p className="mt-1.5 font-mono text-xs text-[#B7C8BA]">
                        {member.focusArea}
                      </p>

                      <p className="mt-4 text-sm leading-[1.68] font-normal text-[#D4E1D8]">
                        {member.bio}
                      </p>
                    </div>

                    <blockquote className="mt-6 border-t border-[#285640] pt-4">
                      <p className="font-editorial text-sm italic text-[#E6C477] sm:text-base">
                        “{member.quote}”
                      </p>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 3: Three Equally Proportioned Cards on Desktop, Balanced Two-Column on Tablet */}
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tier3Team.map((member, idx) => (
                <div
                  key={member.id}
                  data-team-card
                  className={`group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#285640] bg-[#0B4933]/70 p-6 shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-300 hover:border-[#D9B45B]/50 sm:p-8 ${
                    idx === 2
                      ? 'md:col-span-2 md:max-w-md md:mx-auto lg:col-span-1 lg:max-w-none w-full'
                      : 'w-full'
                  }`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-6 w-full overflow-hidden rounded-2xl border border-[#285640] bg-[#032A1D]">
                        <EditorialPortraitFrame member={member} className="aspect-[4/4]" />
                      </div>

                      <h3 className="font-sans text-2xl font-semibold tracking-tight text-[#E8EEE8] sm:text-3xl">
                        {member.name}
                      </h3>
                      <p className="font-sans mt-1 text-xs font-bold tracking-[0.14em] text-[#E6C477] uppercase">
                        {member.role}
                      </p>
                      <p className="mt-1.5 font-mono text-xs text-[#B7C8BA]">
                        {member.focusArea}
                      </p>

                      <p className="mt-4 text-sm leading-[1.68] font-normal text-[#D4E1D8]">
                        {member.bio}
                      </p>
                    </div>

                    <blockquote className="mt-6 border-t border-[#285640] pt-4">
                      <p className="font-editorial text-sm italic text-[#E6C477] sm:text-base">
                        “{member.quote}”
                      </p>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
