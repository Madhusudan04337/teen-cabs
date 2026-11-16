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

function EditorialPortraitFrame({ member }: { member: TeamMember }) {
  return (
    <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#075832] via-[#033A20] to-[#012111] ring-1 ring-[#1A7347]/55 shadow-2xl shadow-black/45">
      {/* Subtle Ambient Gold Rim Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(223,186,120,0.28)_0%,transparent_70%)] blur-2xl"
      />

      {/* Sculpted Editorial Bust Silhouette Shape */}
      <svg
        viewBox="0 0 240 270"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`editorial-sil-${member.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DFBA78" stopOpacity="0.34" />
            <stop offset="60%" stopColor="#82CFA0" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#012B17" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <circle
          cx="120"
          cy="112"
          r="76"
          fill="none"
          stroke="#DFBA78"
          strokeOpacity="0.22"
          strokeWidth="1.2"
          strokeDasharray="5 7"
        />

        <circle
          cx="120"
          cy="98"
          r="34"
          fill={`url(#editorial-sil-${member.id})`}
          stroke="#DFBA78"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <path
          d="M44 270 C 44 196, 76 160, 120 160 C 164 160, 196 196, 196 270 Z"
          fill={`url(#editorial-sil-${member.id})`}
          stroke="#DFBA78"
          strokeOpacity="0.42"
          strokeWidth="1.5"
        />
      </svg>

      {/* Clean Editorial Role & Initials Overlay */}
      <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#DFBA78] uppercase">
            {member.role}
          </p>
          <p className="font-editorial mt-0.5 text-2xl font-medium text-[#F7F3E9]">
            {member.name}
          </p>
        </div>
        <span className="font-editorial flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#012B17]/85 text-sm italic text-[#DFBA78] ring-1 ring-[#DFBA78]/40 backdrop-blur-sm">
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
  const [selectedMemberId, setSelectedMemberId] = useState<string>(TEAM_MEMBERS[0].id);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const selectedIndex = TEAM_MEMBERS.findIndex((m) => m.id === selectedMemberId);
  const activeMember = TEAM_MEMBERS[selectedIndex >= 0 ? selectedIndex : 0];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setSelectedMemberId((prevId) => {
        const idx = TEAM_MEMBERS.findIndex((m) => m.id === prevId);
        return TEAM_MEMBERS[(idx + 1) % TEAM_MEMBERS.length].id;
      });
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, prefersReducedMotion]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 56 : 24;

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
              start: 'top 78%',
              end: 'center 42%',
              scrub: 0.7,
            },
          });
        }

        // Snappy reversible node cascade
        gsap.fromTo(
          '[data-journey-node]',
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#how-it-works',
              start: 'top 76%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Team Editorial Split: Left Portrait Stage & Right Interactive Roster
        gsap.fromTo(
          '[data-team-stage]',
          { x: -offset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#team',
              start: 'top 80%',
              end: 'bottom 14%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          '[data-team-row]',
          { x: offset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.58,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-team-roster]',
              start: 'top 84%',
              end: 'bottom 14%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  const handleSelectMember = (id: string) => {
    setIsAutoPlaying(false);
    setSelectedMemberId(id);
  };

  const handleCycleMember = (direction: -1 | 1) => {
    const nextIndex =
      (selectedIndex + direction + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
    handleSelectMember(TEAM_MEMBERS[nextIndex].id);
  };

  return (
    <div ref={containerRef} className="relative z-10">
      {/* Section 5: How It Works */}
      <section
        id="how-it-works"
        aria-labelledby="journey-heading"
        className="py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-medium tracking-wide text-[#82CFA0]">
                How it works
              </p>
              <h2
                id="journey-heading"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#F7F3E9] sm:text-4xl lg:text-[3rem]"
              >
                Simple steps.
                <span className="font-editorial block font-normal italic text-[#DFBA78]">
                  Safer journeys.
                </span>
              </h2>
            </div>

            <p className="max-w-[38ch] text-base leading-[1.65] font-light text-[#CBE0D3] sm:text-[1.0625rem]">
              From family sign-up to verified drop-off in four calm steps.
            </p>
          </div>

          <div className="relative mt-14 sm:mt-16">
            <svg
              viewBox="0 0 1100 80"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute top-4 left-0 hidden w-full lg:block"
            >
              <path
                d="M 80 40 Q 260 8, 420 40 T 760 40 T 1020 40"
                stroke="#0E5A35"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                ref={routePathRef}
                d="M 80 40 Q 260 8, 420 40 T 760 40 T 1020 40"
                stroke="#DFBA78"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {JOURNEY_STEPS.map((item, idx) => {
                const Icon = STEP_ICONS[idx];
                const isHighlighted = idx === activeStepIndex;
                return (
                  <li key={item.id} data-journey-node>
                    <button
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      aria-current={isHighlighted ? 'step' : undefined}
                      className={`group flex h-full w-full cursor-pointer flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 ${
                        isHighlighted
                          ? 'border-[#DFBA78]/60 bg-[#02391F]/70'
                          : 'border-[#14653C]/50 bg-[#02351C]/40 hover:border-[#DFBA78]/40'
                      }`}
                    >
                      <span
                        className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-[#DFBA78] text-[#012B17] shadow-xl shadow-[#DFBA78]/15'
                            : 'bg-[#02391F] text-[#DFBA78] ring-1 ring-[#0E5A35] group-hover:bg-[#054928]'
                        }`}
                      >
                        {isHighlighted && (
                          <span
                            aria-hidden="true"
                            className="animate-radar-ripple absolute inset-0 rounded-full ring-2 ring-[#DFBA78]"
                          />
                        )}
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>

                      <h3
                        className={`mt-5 text-lg leading-snug font-medium transition-colors sm:text-xl ${
                          isHighlighted
                            ? 'text-[#DFBA78]'
                            : 'text-[#F7F3E9] group-hover:text-[#DFBA78]'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-[1.65] font-light text-[#CBE0D3] sm:text-[0.9375rem]">
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

      {/* Section 6: Meet the Team — Unboxed Asymmetric Portrait Stage + Clean 6-Leader Directory */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 pb-10 sm:pb-12 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-medium tracking-wide text-[#82CFA0]">
                Meet the team
              </p>
              <h2
                id="team-heading"
                className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#F7F3E9] sm:text-4xl lg:text-[3rem]"
              >
                Good people.
                <span className="font-editorial block font-normal italic text-[#DFBA78]">
                  Building Forgeit &amp; Teen Cabs.
                </span>
              </h2>
            </div>

            {/* Clean Spotlight Transport Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleCycleMember(-1)}
                aria-label="Previous team member"
                className="inline-flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#02391F] text-[#F7F3E9] transition-colors hover:bg-[#DFBA78] hover:text-[#012B17]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                aria-label={
                  isAutoPlaying ? 'Pause team spotlight' : 'Auto-play team spotlight'
                }
                className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full bg-[#02391F] px-4 py-2 text-xs font-medium text-[#CBE0D3] hover:text-[#DFBA78]"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-[#DFBA78]" aria-hidden="true" />
                    <span>Auto story</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-[#82CFA0]" aria-hidden="true" />
                    <span>Manual</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCycleMember(1)}
                aria-label="Next team member"
                className="inline-flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#02391F] text-[#F7F3E9] transition-colors hover:bg-[#DFBA78] hover:text-[#012B17]"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Open 2-Column Editorial Spotlight + Clean 6-Member List */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left: Sculpted Portrait Aperture & Bio Quote */}
            <div data-team-stage className="lg:col-span-5" aria-live="polite">
              <div className="mx-auto max-w-[340px] lg:mx-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMember.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.26, ease: 'easeOut' }}
                  >
                    <EditorialPortraitFrame member={activeMember} />

                    <div className="mt-5 rounded-2xl border border-[#14653C]/55 bg-[#02351C]/45 p-5">
                      <p className="text-sm leading-[1.65] font-light text-[#CBE0D3] sm:text-[0.9375rem]">
                        {activeMember.bio}
                      </p>

                      <blockquote className="mt-4 flex items-start gap-3 border-t border-[#0E5A35]/70 pt-4">
                        <Quote
                          className="mt-1 h-4 w-4 shrink-0 text-[#DFBA78]"
                          aria-hidden="true"
                        />
                        <p className="font-editorial text-lg leading-snug italic text-[#F7F3E9]">
                          “{activeMember.quote}”
                        </p>
                      </blockquote>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: 6 Open Hairline Member Rows (Zero Box Grid, Zero Pyramid) */}
            <div
              data-team-roster
              className="divide-y divide-[#0E5A35]/70 border-y border-[#0E5A35]/70 lg:col-span-7"
            >
              {TEAM_MEMBERS.map((member) => {
                const isSelected = member.id === activeMember.id;
                return (
                  <button
                    key={member.id}
                    type="button"
                    data-team-row
                    onClick={() => handleSelectMember(member.id)}
                    aria-pressed={isSelected}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 py-4.5 text-left transition-colors sm:py-5"
                  >
                    <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                      <span
                        className={`font-editorial flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base italic transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#DFBA78] text-[#012B17] shadow-lg shadow-[#DFBA78]/20'
                            : 'bg-[#02391F] text-[#DFBA78] ring-1 ring-[#1A7347]/60 group-hover:bg-[#054928]'
                        }`}
                      >
                        {member.initials}
                      </span>

                      <div className="min-w-0">
                        <h3
                          className={`font-editorial truncate text-xl font-medium transition-colors sm:text-2xl ${
                            isSelected
                              ? 'text-[#DFBA78]'
                              : 'text-[#F7F3E9] group-hover:text-[#DFBA78]'
                          }`}
                        >
                          {member.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#82CFA0] uppercase">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`hidden shrink-0 text-xs font-medium transition-colors sm:inline ${
                        isSelected
                          ? 'text-[#DFBA78]'
                          : 'text-[#9BC5AD] group-hover:text-[#F7F3E9]'
                      }`}
                    >
                      {member.focusArea}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
