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
  { id: 'all', label: 'All Team' },
  { id: 'founder', label: 'Founders' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'core', label: 'Core Team' },
  { id: 'product', label: 'Product Team' },
];

function PortraitAsset({
  member,
  eager = false,
  compact = false,
}: {
  member: TeamMember;
  eager?: boolean;
  compact?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member.id, member.portraitSrc]);

  const showPhoto = Boolean(member.portraitSrc) && !imgError;

  if (showPhoto) {
    return (
      <img
        src={member.portraitSrc}
        alt={`${member.name}, ${member.role} at Forgeit and Teen Cabs`}
        onError={() => setImgError(true)}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B4933] via-[#063B27] to-[#032A1D]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-1/2 h-40 w-40 -translate-x-1/2 transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.2)_0%,transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className={`flex items-center justify-center rounded-full border border-[#E6C477]/35 bg-[#032A1D]/55 ${
          compact ? 'h-16 w-16 -translate-y-4 sm:h-20 sm:w-20' : 'h-24 w-24'
        }`}
      >
        <span
          className={`font-editorial font-normal italic text-[#E6C477] ${
            compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
          }`}
        >
          {member.initials}
        </span>
      </div>
      {!compact && (
        <span className="mt-3 text-[10px] font-medium tracking-[0.2em] text-[#B7C8BA]/80 uppercase">
          {member.role}
        </span>
      )}
    </div>
  );
}

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spotlightWrapRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, scrollTo } = useLenis();

  const [activeCategory, setActiveCategory] = useState<TeamCategoryId>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isSpotlight, setIsSpotlight] = useState(false);

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

  const handleCategoryChange = useCallback((nextCategory: TeamCategoryId) => {
    setActiveCategory(nextCategory);
    setActiveIndex(0);
    setSlideDirection(1);
    setIsSpotlight(false);
  }, []);

  const handleInspectFromAll = useCallback(
    (member: TeamMember) => {
      const groupMembers = TEAM_MEMBERS.filter((m) => m.group === member.group);
      const indexInGroup = Math.max(
        0,
        groupMembers.findIndex((m) => m.id === member.id)
      );
      setActiveCategory(member.group);
      setActiveIndex(indexInGroup);
      setIsSpotlight(true);

      if (window.innerWidth < 1024 && contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        if (rect.top < 72 || rect.top > window.innerHeight * 0.6) {
          scrollTo(contentRef.current, {
            offset: -84,
            immediate: prefersReducedMotion,
          });
        }
      }
    },
    [prefersReducedMotion, scrollTo]
  );

  const canGoPrev = safeActiveIndex > 0;
  const canGoNext = safeActiveIndex < filteredMembers.length - 1;

  const handlePrev = useCallback(() => {
    if (!canGoPrev) return;
    setSlideDirection(-1);
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, [canGoPrev]);

  const handleNext = useCallback(() => {
    if (!canGoNext) return;
    setSlideDirection(1);
    setActiveIndex((prev) => Math.min(filteredMembers.length - 1, prev + 1));
  }, [canGoNext, filteredMembers.length]);

  const handleSpotlightKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (activeCategory === 'all') return;
      if (event.key === 'ArrowRight' && canGoNext) {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft' && canGoPrev) {
        event.preventDefault();
        handlePrev();
      }
    },
    [activeCategory, canGoNext, canGoPrev, handleNext, handlePrev]
  );

  const formatIndex = (value: number) => String(value).padStart(2, '0');
  const isDirectoryView = !isSpotlight;
  const isAllView = activeCategory === 'all';

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative z-10 min-h-[calc(100vh-5rem)] overflow-x-clip bg-transparent py-12 text-[#063B27] sm:py-16 lg:py-24"
    >

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT SIDEBAR: Editorial Heading, 3-4 Line Description & Category Filter */}
          <aside className="lg:sticky lg:top-28 lg:col-span-4">
            <p
              data-team-intro
              className="text-xs font-medium tracking-wide text-[#547064] sm:text-sm"
            >
              Our leadership
            </p>

            <h1
              id="team-heading"
              data-team-intro
              className="mt-3 text-balance text-3xl leading-[1.08] font-semibold tracking-[-0.025em] text-[#063B27] sm:text-4xl lg:text-[2.75rem]"
            >
              The People Behind{' '}
              <span className="font-editorial block font-normal italic text-[#8A6720]">
                Teen Cabs
              </span>
            </h1>

            <p
              data-team-intro
              className="mt-4 max-w-[38ch] text-sm leading-[1.78] font-light text-[#365647] sm:text-[0.9375rem]"
            >
              Forgeit and Teen Cabs are built by a multidisciplinary team of
              strategists, engineers, designers, and outreach leads united by a
              single goal: giving parents calm visibility while helping teens move
              with confidence and everyday independence.
            </p>

            {/* Desktop Vertical Category Selectors */}
            <nav
              data-team-intro
              aria-label="Filter team members by category"
              className="mt-8 hidden border-t border-[#C8C1AA] lg:block"
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
                        ? 'border-[#8A6720]/60 text-[#063B27]'
                        : 'border-[#C8C1AA] text-[#365647] hover:border-[#D9B45B]/70 hover:text-[#063B27]'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-medium tracking-wide whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className={`h-px transition-all duration-200 ${
                          isActive
                            ? 'w-5 bg-[#8A6720]'
                            : 'w-2.5 bg-[#B4A989] group-hover:w-4 group-hover:bg-[#D9B45B]/60'
                        }`}
                      />
                      <span>{category.label}</span>
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                        isActive
                          ? 'text-[#8A6720]'
                          : 'text-[#547064] group-hover:text-[#063B27]'
                      }`}
                    >
                      {formatIndex(count)}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile & Tablet Horizontal Category Tabs */}
            <nav
              data-team-intro
              aria-label="Filter team members by category"
              className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
            >
              {TEAM_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? 'border-[#D9B45B]/60 bg-[#063B27] text-[#F3F0E6]'
                        : 'border-[#C8C1AA] bg-[#FFFDF7] text-[#365647] hover:border-[#D9B45B]/70'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="font-mono text-[10px] opacity-75 tabular-nums">
                      {formatIndex(categoryCounts[category.id])}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT CONTENT: All-Members Directory Grid OR Single-Category Spotlight */}
          <div
            ref={contentRef}
            onKeyDown={handleSpotlightKeyDown}
            tabIndex={-1}
            className="min-w-0 focus:outline-none lg:col-span-8"
          >
            {/* Top Status & Arrow Navigation Header */}
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#C8C1AA] pb-3.5 sm:mb-8 sm:pb-4">
              <div className="flex items-center gap-2.5 font-mono text-xs tabular-nums">
                <span className="tracking-[0.12em] text-[#8A6720] uppercase">
                  {activeCategoryLabel}
                </span>
                <span aria-hidden="true" className="text-[#B4A989]">
                  /
                </span>
                {isDirectoryView ? (
                  <span className="text-[#547064]">
                    {formatIndex(filteredMembers.length)} Members
                  </span>
                ) : (
                  <>
                    <span className="text-[#063B27]">
                      {formatIndex(safeActiveIndex + 1)}
                    </span>
                    <span aria-hidden="true" className="text-[#547064]/60">
                      of
                    </span>
                    <span className="text-[#547064]">
                      {formatIndex(filteredMembers.length)}
                    </span>
                  </>
                )}
              </div>

              {isSpotlight && filteredMembers.length > 1 && (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    aria-label="Previous team member"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#B4A989] text-[#063B27] transition-colors duration-150 hover:border-[#063B27] hover:text-[#063B27] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    aria-label="Next team member"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#B4A989] text-[#063B27] transition-colors duration-150 hover:border-[#063B27] hover:text-[#063B27] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* VIEW SWITCH: All Members Grid vs Single Member Spotlight */}
            <div
              ref={spotlightWrapRef}
              aria-live="polite"
              className="relative z-10 lg:static"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDirectoryView ? (
                  <motion.div
                    key="all-grid"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.12,
                      ease: 'easeOut',
                    }}
                    className="space-y-10 sm:space-y-12"
                  >
                    {(isAllView
                      ? TEAM_CATEGORIES.filter(
                          (category) =>
                            category.id !== 'all' && categoryCounts[category.id] > 0
                        )
                      : TEAM_CATEGORIES.filter(
                          (category) => category.id === activeCategory
                        )
                    ).map((category) => {
                      const members = TEAM_MEMBERS.filter(
                        (member) => member.group === category.id
                      );

                      return (
                        <section key={category.id} aria-labelledby={`${category.id}-team-heading`}>
                          <div className="mb-4 flex items-center gap-3 border-b border-[#C8C1AA] pb-3">
                            <h2
                              id={`${category.id}-team-heading`}
                              className="font-editorial text-2xl font-normal italic text-[#063B27] sm:text-3xl"
                            >
                              {category.label}
                            </h2>
                            <span className="font-mono text-xs text-[#547064] tabular-nums">
                              {formatIndex(members.length)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5">
                            {members.map((member, index) => (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => handleInspectFromAll(member)}
                                aria-label={`View profile for ${member.name}, ${member.role}`}
                                className="group flex min-w-0 flex-col rounded-2xl border border-[#AAB69D] bg-[#C5CCB8] p-2.5 text-left shadow-lg shadow-[#063B27]/10 transition-colors hover:border-[#D9B45B] hover:bg-[#BBC5AE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#063B27] sm:p-3"
                              >
                                <div className="mx-auto aspect-[4/5] w-[86%] max-w-[220px] overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#061a12]/60 sm:w-full">
                                  <PortraitAsset
                                    member={member}
                                    eager={index < 6}
                                    compact
                                  />
                                </div>

                                <div className="w-full px-1 pt-3 pb-1">
                                  <p className="text-[9px] font-semibold tracking-[0.12em] text-[#8A6720] uppercase sm:text-[10px]">
                                    {member.role}
                                  </p>
                                  <h3 className="mt-1 truncate text-sm font-semibold tracking-tight text-[#063B27] sm:text-base">
                                    {member.name}
                                  </h3>
                                </div>
                              </button>
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.article
                    key={selectedMember.id}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, x: slideDirection * 64 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, x: slideDirection * -64 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.11,
                      ease: 'easeOut',
                    }}
                    className="grid grid-cols-1 gap-5 rounded-2xl border border-[#AAB69D] bg-[#C5CCB8] p-4 shadow-xl shadow-[#063B27]/10 sm:p-5 md:grid-cols-12 md:items-stretch md:gap-8 md:p-7 lg:gap-10 lg:p-8"
                  >
                    {/* Featured Single Portrait */}
                    <div className="md:col-span-5">
                      <div className="mx-auto aspect-[4/5] w-[82%] max-w-[280px] overflow-hidden rounded-xl border border-[#d4af37]/20 bg-[#061a12]/60 shadow-lg shadow-black/25 sm:w-[72%] sm:max-w-[300px] md:w-full md:max-w-none md:rounded-2xl md:shadow-xl">
                        <PortraitAsset member={selectedMember} eager />
                      </div>
                    </div>

                    {/* Editorial Profile & Pull Quote */}
                    <div className="min-w-0 md:col-span-7 md:flex md:flex-col md:justify-between md:py-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9px] leading-tight font-medium tracking-wide text-[#547064] sm:text-[10px]">
                          <span className="tracking-[0.08em] text-[#8A6720] uppercase">
                            {selectedMember.role}
                          </span>
                          <span aria-hidden="true" className="text-[#B4A989]">
                            ·
                          </span>
                          <span>{selectedMember.focusArea}</span>
                        </div>

                        <h2 className="mt-1.5 text-base leading-tight font-semibold tracking-tight text-[#063B27] sm:text-xl md:mt-2.5 md:text-2xl lg:text-[2rem]">
                          {selectedMember.name}
                        </h2>

                        <p className="mt-3 max-w-[48ch] text-[13px] leading-[1.65] font-light text-[#365647] sm:text-sm md:mt-4 md:text-base md:leading-[1.8]">
                          {selectedMember.bio}
                        </p>
                      </div>

                      <blockquote className="mt-5 border-t border-[#d4af37]/15 pt-5 md:mt-7 lg:mt-8 lg:pt-6">
                        <p className="font-editorial text-[17px] leading-[1.5] italic text-[#8A6720] sm:text-lg">
                          “{selectedMember.quote}”
                        </p>
                      </blockquote>
                    </div>
                  </motion.article>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
