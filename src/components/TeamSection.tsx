import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap, useGSAP } from '../motion/setup';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
} from '../motion/tokens';
import { useLenis } from '../motion/LenisContext';
import { TEAM_MEMBERS, type TeamMember } from '../data/teenCabsData';

type TeamCategoryId = 'all' | TeamMember['group'];

const TEAM_CATEGORIES: ReadonlyArray<{
  id: TeamCategoryId;
  label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'founder', label: 'Founder' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'core', label: 'Core Team' },
  { id: 'product', label: 'Product Team' },
];

function EditorialPortraitFrame({
  member,
  isSelected,
  eager,
}: {
  member: TeamMember;
  isSelected: boolean;
  eager: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member.id, member.portraitSrc]);

  const showPhoto = Boolean(member.portraitSrc) && !imgError;

  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#0B4933] via-[#063B27] to-[#032A1D] transition-colors duration-200 ${
        isSelected
          ? 'ring-1 ring-[#E6C477]/80'
          : 'ring-1 ring-[#285640]/80 group-hover:ring-[#D9B45B]/55'
      }`}
    >
      {showPhoto ? (
        <>
          <img
            src={member.portraitSrc}
            alt={`${member.name}, ${member.role} at Forgeit and Teen Cabs`}
            onError={() => setImgError(true)}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#032A1D]/55 via-transparent to-transparent"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 left-1/2 h-56 w-56 -translate-x-1/2 transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.16)_0%,transparent_66%)]"
          />

          <svg viewBox="0 0 240 300" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient
                id={`editorial-sil-${member.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#E6C477" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#D9B45B" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#032A1D" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            <circle
              cx="120"
              cy="126"
              r="76"
              fill="none"
              stroke="#E6C477"
              strokeOpacity="0.22"
              strokeWidth="1.2"
              strokeDasharray="5 7"
            />
            <circle
              cx="120"
              cy="112"
              r="34"
              fill={`url(#editorial-sil-${member.id})`}
              stroke="#E6C477"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <path
              d="M44 300 C 44 218, 76 178, 120 178 C 164 178, 196 218, 196 300 Z"
              fill={`url(#editorial-sil-${member.id})`}
              stroke="#E6C477"
              strokeOpacity="0.42"
              strokeWidth="1.5"
            />
          </svg>

          <span
            aria-hidden="true"
            className="font-editorial pointer-events-none absolute right-4 bottom-4 text-sm italic text-[#E6C477]/85"
          >
            {member.initials}
          </span>
        </>
      )}
    </div>
  );
}

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { prefersReducedMotion } = useLenis();

  const [activeCategory, setActiveCategory] = useState<TeamCategoryId>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const categoryCounts = useMemo(() => {
    const counts: Record<TeamCategoryId, number> = {
      all: TEAM_MEMBERS.length,
      founder: 0,
      leadership: 0,
      core: 0,
      product: 0,
    };
    TEAM_MEMBERS.forEach((member) => {
      counts[member.group] += 1;
    });
    return counts;
  }, []);

  const filteredMembers = useMemo(() => {
    if (activeCategory === 'all') return TEAM_MEMBERS;
    return TEAM_MEMBERS.filter((member) => member.group === activeCategory);
  }, [activeCategory]);

  const activeCategoryLabel =
    TEAM_CATEGORIES.find((cat) => cat.id === activeCategory)?.label ?? 'All';

  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(0, filteredMembers.length - 1)
  );
  const selectedMember = filteredMembers[safeActiveIndex] ?? TEAM_MEMBERS[0];

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offsetY = isDesktop ? MOTION_DISTANCE.desktopY : MOTION_DISTANCE.mobileY;
        const introEls = gsap.utils.toArray<HTMLElement>('[data-team-intro]', root);

        if (introEls.length > 0) {
          gsap.fromTo(
            introEls,
            { y: offsetY * 0.75, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              stagger: 0.08,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const scrollCardIntoTrack = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const card = cardRefs.current[index];
      if (!track || !card) return;

      const trackRect = track.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const cardLeftInTrack = cardRect.left - trackRect.left + track.scrollLeft;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const targetLeft = Math.min(maxScroll, Math.max(0, cardLeftInTrack));

      track.scrollTo({
        left: targetLeft,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion]
  );

  const handleCategoryChange = useCallback(
    (nextCategory: TeamCategoryId) => {
      setActiveCategory(nextCategory);
      setActiveIndex(0);
      if (trackRef.current) {
        trackRef.current.scrollTo({
          left: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [prefersReducedMotion]
  );

  const handleSelectMember = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollCardIntoTrack(index);
    },
    [scrollCardIntoTrack]
  );

  const canGoPrev = safeActiveIndex > 0;
  const canGoNext = safeActiveIndex < filteredMembers.length - 1;

  const handlePrev = useCallback(() => {
    if (!canGoPrev) return;
    const nextIdx = safeActiveIndex - 1;
    setActiveIndex(nextIdx);
    scrollCardIntoTrack(nextIdx);
  }, [canGoPrev, safeActiveIndex, scrollCardIntoTrack]);

  const handleNext = useCallback(() => {
    if (!canGoNext) return;
    const nextIdx = safeActiveIndex + 1;
    setActiveIndex(nextIdx);
    scrollCardIntoTrack(nextIdx);
  }, [canGoNext, safeActiveIndex, scrollCardIntoTrack]);

  const handleGalleryKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (canGoNext) {
          const nextIdx = safeActiveIndex + 1;
          setActiveIndex(nextIdx);
          scrollCardIntoTrack(nextIdx);
          cardRefs.current[nextIdx]?.focus({ preventScroll: true });
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (canGoPrev) {
          const prevIdx = safeActiveIndex - 1;
          setActiveIndex(prevIdx);
          scrollCardIntoTrack(prevIdx);
          cardRefs.current[prevIdx]?.focus({ preventScroll: true });
        }
      }
    },
    [canGoNext, canGoPrev, safeActiveIndex, scrollCardIntoTrack]
  );

  const formatIndex = (value: number) => String(value).padStart(2, '0');

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative z-10 overflow-x-clip bg-[#063B27] py-14 sm:py-18 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.07)_0%,transparent_68%)]"
      />

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT SIDEBAR: Editorial Heading, Intro Copy & Category Navigation */}
          <aside className="lg:sticky lg:top-28 lg:col-span-4">
            <p
              data-team-intro
              className="text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm"
            >
              Our leadership
            </p>

            <h1
              id="team-heading"
              data-team-intro
              className="mt-3 text-balance text-3xl leading-[1.08] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[2.75rem]"
            >
              The People Behind{' '}
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                Teen Cabs
              </span>
            </h1>

            <p
              data-team-intro
              className="mt-4 max-w-[36ch] text-sm leading-[1.72] font-light text-[#D4E1D8] sm:text-base"
            >
              The experienced minds and designers building Forgeit and Teen Cabs.
            </p>

            {/* Desktop Vertical Category Selectors */}
            <nav
              data-team-intro
              aria-label="Filter team members by category"
              className="mt-8 hidden border-t border-[#285640] lg:block"
            >
              {TEAM_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                const count = categoryCounts[category.id];
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`group flex min-h-[46px] w-full cursor-pointer items-center justify-between border-b py-3 text-left transition-colors duration-200 ${
                      isActive
                        ? 'border-[#E6C477]/80 text-[#E6C477]'
                        : 'border-[#285640]/80 text-[#D4E1D8] hover:border-[#D9B45B]/50 hover:text-[#E8EEE8]'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-medium tracking-wide whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className={`h-px transition-all duration-200 ${
                          isActive
                            ? 'w-5 bg-[#E6C477]'
                            : 'w-2.5 bg-[#285640] group-hover:w-4 group-hover:bg-[#D9B45B]/60'
                        }`}
                      />
                      <span>{category.label}</span>
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                        isActive
                          ? 'text-[#E6C477]'
                          : 'text-[#B7C8BA]/75 group-hover:text-[#D4E1D8]'
                      }`}
                    >
                      {formatIndex(count)}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Tablet & Mobile Horizontally Scrollable Category Strip */}
            <nav
              data-team-intro
              aria-label="Filter team members by category"
              className="mt-7 flex items-center gap-6 overflow-x-auto border-b border-[#285640] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
            >
              {TEAM_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                const count = categoryCounts[category.id];
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative flex min-h-[44px] shrink-0 cursor-pointer items-center gap-2 border-b-2 pb-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? 'border-[#E6C477] text-[#E6C477]'
                        : 'border-transparent text-[#D4E1D8] hover:text-[#E8EEE8]'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? 'text-[#E6C477]' : 'text-[#B7C8BA]/70'
                      }`}
                    >
                      {formatIndex(count)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT CONTENT: Horizontal Editorial Portrait Gallery & Active Member Detail */}
          <div className="min-w-0 lg:col-span-8">
            {/* Gallery Header Bar: Category Status + Previous / Next Controls */}
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#285640]/80 pb-4">
              <div className="flex items-center gap-2.5 font-mono text-xs tabular-nums">
                <span className="text-[#E6C477] uppercase tracking-[0.12em]">
                  {activeCategoryLabel}
                </span>
                <span aria-hidden="true" className="text-[#285640]">
                  /
                </span>
                <span className="text-[#E8EEE8]">
                  {formatIndex(safeActiveIndex + 1)}
                </span>
                <span aria-hidden="true" className="text-[#B7C8BA]/60">
                  of
                </span>
                <span className="text-[#B7C8BA]">
                  {formatIndex(filteredMembers.length)}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!canGoPrev}
                  aria-label="Previous team member"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#285640] text-[#E8EEE8] transition-colors duration-200 hover:border-[#E6C477] hover:text-[#E6C477] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  aria-label="Next team member"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#285640] text-[#E8EEE8] transition-colors duration-200 hover:border-[#E6C477] hover:text-[#E6C477] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Horizontal Portrait Track */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCategory}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.24,
                  ease: MOTION_EASE.motionEditorial,
                }}
              >
                <div
                  ref={trackRef}
                  role="region"
                  aria-label={`${activeCategoryLabel} portrait gallery`}
                  tabIndex={0}
                  onKeyDown={handleGalleryKeyDown}
                  className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 scroll-smooth focus:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-7"
                >
                  {filteredMembers.map((member, index) => {
                    const isSelected = index === safeActiveIndex;
                    return (
                      <article
                        key={member.id}
                        className="w-[74vw] max-w-[290px] shrink-0 snap-start sm:w-[270px] lg:w-[280px]"
                      >
                        <button
                          ref={(el) => {
                            cardRefs.current[index] = el;
                          }}
                          type="button"
                          onClick={() => handleSelectMember(index)}
                          aria-pressed={isSelected}
                          className="group block w-full cursor-pointer rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6C477]"
                        >
                          <EditorialPortraitFrame
                            member={member}
                            isSelected={isSelected}
                            eager={index < 3}
                          />

                          <div className="mt-4">
                            <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
                              {member.role}
                            </p>
                            <h2 className="font-sans mt-1 text-xl font-semibold tracking-tight text-[#E8EEE8] transition-colors duration-200 group-hover:text-[#F3F0E6]">
                              {member.name}
                            </h2>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#B7C8BA]">
                              {member.focusArea}
                            </p>
                            <div
                              aria-hidden="true"
                              className={`mt-3.5 h-px w-full transition-colors duration-200 ${
                                isSelected
                                  ? 'bg-[#E6C477]'
                                  : 'bg-[#285640]/70 group-hover:bg-[#D9B45B]/55'
                              }`}
                            />
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Selected Member Editorial Biography & Pull-Quote Band */}
            <div
              aria-live="polite"
              className="mt-6 border-t border-[#285640] pt-6 sm:mt-8 sm:pt-7"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedMember.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.22,
                    ease: MOTION_EASE.motionEditorial,
                  }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start md:gap-8"
                >
                  <div className="md:col-span-7">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#B7C8BA]">
                      <span className="text-[#E8EEE8]">{selectedMember.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#E6C477]">{selectedMember.role}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedMember.focusArea}</span>
                    </div>

                    <p className="mt-3 text-sm leading-[1.75] font-light text-[#D4E1D8] sm:text-base">
                      {selectedMember.bio}
                    </p>
                  </div>

                  <blockquote className="md:col-span-5">
                    <p className="font-editorial text-lg leading-[1.48] italic text-[#E6C477] sm:text-[1.1875rem]">
                      “{selectedMember.quote}”
                    </p>
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
