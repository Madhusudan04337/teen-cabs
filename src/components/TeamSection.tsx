import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import { gsap, useGSAP } from '../motion/setup';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
} from '../motion/tokens';
import { useLenis } from '../motion/LenisContext';
import { TEAM_MEMBERS, type TeamMember } from '../data/teenCabsData';

type TeamCategoryId = TeamMember['group'];

const TEAM_CATEGORIES: ReadonlyArray<{
  id: TeamCategoryId;
  label: string;
}> = [
  { id: 'founder', label: 'Founders' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'core', label: 'Core Team' },
  { id: 'product', label: 'Product Team' },
];

function PortraitAsset({
  member,
  eager = false,
  hoverZoom = false,
}: {
  member: TeamMember;
  eager?: boolean;
  hoverZoom?: boolean;
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
        className={`h-full w-full object-cover object-top ${
          hoverZoom
            ? 'transition-transform duration-300 ease-out group-hover:scale-[1.03]'
            : ''
        }`}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B4933] via-[#063B27] to-[#032A1D]">
      <div
        aria-hidden="true"
        className="flex h-20 w-20 items-center justify-center rounded-full border border-[#E6C477]/35 bg-[#032A1D]/55"
      >
        <span className="font-editorial text-2xl font-normal italic text-[#E6C477]">
          {member.initials}
        </span>
      </div>
    </div>
  );
}

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, scrollTo } = useLenis();

  const [activeCategory, setActiveCategory] = useState<TeamCategoryId>('founder');
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isSpotlight, setIsSpotlight] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<TeamCategoryId, number> = {
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

  const filteredMembers = useMemo(
    () => TEAM_MEMBERS.filter((member) => member.group === activeCategory),
    [activeCategory]
  );

  const activeCategoryLabel =
    TEAM_CATEGORIES.find((cat) => cat.id === activeCategory)?.label ?? 'Founders';

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

  const handleCategoryChange = useCallback(
    (nextCategory: TeamCategoryId) => {
      setActiveCategory(nextCategory);
      setActiveIndex(0);
      setSlideDirection(1);
      setIsSpotlight(false);

      if (window.innerWidth < 1024 && contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        if (rect.top < 72) {
          scrollTo(contentRef.current, {
            offset: -84,
            immediate: prefersReducedMotion,
          });
        }
      }
    },
    [prefersReducedMotion, scrollTo]
  );

  const handleSelectMemberCard = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setSlideDirection(1);
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
      if (!isSpotlight) return;
      if (event.key === 'ArrowRight' && canGoNext) {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft' && canGoPrev) {
        event.preventDefault();
        handlePrev();
      }
    },
    [isSpotlight, canGoNext, canGoPrev, handleNext, handlePrev]
  );

  const formatIndex = (value: number) => String(value).padStart(2, '0');
  const usesThreeCols = filteredMembers.length % 3 === 0;

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative z-10 min-h-[calc(100vh-5rem)] overflow-x-clip bg-transparent py-12 text-[#063B27] sm:py-16 lg:py-24"
    >
      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT SIDEBAR: Editorial Heading, Description & Category Filter Rail */}
          <aside className="lg:sticky lg:top-28 lg:col-span-4">
            <p
              data-team-intro
              className="text-xs font-semibold tracking-wide text-[#365647] sm:text-sm"
            >
              Our leadership
            </p>

            <h1
              id="team-heading"
              data-team-intro
              className="mt-3 text-balance text-3xl leading-[1.08] font-bold tracking-[-0.025em] text-[#061a12] sm:text-4xl lg:text-[2.75rem]"
            >
              The People Behind{' '}
              <span className="font-editorial block font-normal italic text-[#6B4F14]">
                Teen Cabs
              </span>
            </h1>

            <p
              data-team-intro
              className="mt-4 max-w-[38ch] text-sm leading-[1.72] font-normal text-[#061a12] sm:text-[0.9375rem]"
            >
              Forgeit and Teen Cabs are built by a multidisciplinary team of
              strategists, engineers, designers, and outreach leads united by a
              single goal: giving parents calm visibility while helping teens
              move with confidence and everyday independence.
            </p>

            {/* Desktop Vertical Filter Rail */}
            <nav
              data-team-intro
              aria-label="Filter team members by category"
              className="mt-8 hidden border-t border-[#A8A08A] lg:block"
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
                        ? 'border-[#8A6720] font-bold text-[#061a12]'
                        : 'border-[#A8A08A] text-[#061a12]/80 hover:border-[#8A6720] hover:text-[#061a12]'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold tracking-wide whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className={`h-[1.5px] transition-all duration-200 ${
                          isActive
                            ? 'w-5 bg-[#8A6720]'
                            : 'w-2.5 bg-[#695F46] group-hover:w-4 group-hover:bg-[#8A6720]'
                        }`}
                      />
                      <span>{category.label}</span>
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                        isActive
                          ? 'font-bold text-[#6B4F14]'
                          : 'text-[#365647] group-hover:text-[#061a12]'
                      }`}
                    >
                      {formatIndex(count)}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile & Tablet Horizontally Scrollable Filter Pills */}
            <nav
              data-team-intro
              aria-label="Filter team members by category"
              className="-mx-6 mt-6 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
            >
              {TEAM_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`inline-flex min-h-[42px] shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? 'border-[#063B27] bg-[#063B27] text-[#FFFDF7]'
                        : 'border-[#A8A08A]/75 bg-[#FFFDF7] text-[#061a12] hover:border-[#8A6720]'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="font-mono text-[11px] opacity-85 tabular-nums">
                      {formatIndex(categoryCounts[category.id])}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT CONTENT: Per-Category Grid View OR Detailed Spotlight View */}
          <div
            ref={contentRef}
            onKeyDown={handleSpotlightKeyDown}
            tabIndex={-1}
            className="min-w-0 focus:outline-none lg:col-span-8"
          >
            {/* Top Status & Controls Header */}
            <div className="mb-6 flex min-h-[44px] flex-wrap items-center justify-between gap-x-3 gap-y-2.5 border-b border-[#A8A08A] pb-3.5 sm:mb-8 sm:pb-4">
              <div className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] font-semibold tabular-nums sm:gap-2.5 sm:text-xs">
                <span className="tracking-[0.1em] text-[#6B4F14] uppercase sm:tracking-[0.12em]">
                  {activeCategoryLabel}
                </span>
                <span aria-hidden="true" className="text-[#695F46]">
                  /
                </span>
                {!isSpotlight ? (
                  <span className="text-[#061a12]">
                    {formatIndex(filteredMembers.length)}{' '}
                    {filteredMembers.length === 1 ? 'Member' : 'Members'}
                  </span>
                ) : (
                  <>
                    <span className="text-[#061a12]">
                      {formatIndex(safeActiveIndex + 1)}
                    </span>
                    <span aria-hidden="true" className="text-[#695F46]">
                      of
                    </span>
                    <span className="text-[#061a12]">
                      {formatIndex(filteredMembers.length)}
                    </span>
                  </>
                )}
              </div>

              {isSpotlight && (
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSpotlight(false)}
                    aria-label={`Back to ${activeCategoryLabel} grid view`}
                    title="Grid view"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#063B27]/20 bg-[#FCF9F2] text-xs font-semibold text-[#061a12] whitespace-nowrap transition-colors duration-150 hover:border-[#063B27] hover:bg-[#063B27] hover:text-[#FFFDF7] sm:h-11 sm:w-auto sm:px-3.5"
                  >
                    <LayoutGrid className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Grid view</span>
                  </button>

                  {filteredMembers.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={!canGoPrev}
                        aria-label="Previous team member"
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#695F46] text-[#061a12] transition-colors duration-150 hover:border-[#061a12] hover:bg-[#061a12] hover:text-[#FFFDF7] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canGoNext}
                        aria-label="Next team member"
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#695F46] text-[#061a12] transition-colors duration-150 hover:border-[#061a12] hover:bg-[#061a12] hover:text-[#FFFDF7] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11"
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* PER-CATEGORY GRID OR DETAILED SPOTLIGHT CARD */}
            <div aria-live="polite" className="relative z-10">
              <AnimatePresence mode="wait" initial={false}>
                {!isSpotlight ? (
                  <motion.section
                    key={`grid-${activeCategory}`}
                    aria-labelledby={`${activeCategory}-team-heading`}
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.14,
                      ease: 'easeOut',
                    }}
                  >
                    <div className="mb-5 flex items-baseline gap-2.5 border-b border-[#A8A08A] pb-3">
                      <h2
                        id={`${activeCategory}-team-heading`}
                        className="font-editorial text-2xl font-bold italic text-[#061a12] sm:text-[1.75rem]"
                      >
                        {activeCategoryLabel}
                      </h2>
                      <span className="font-mono text-xs font-semibold text-[#365647] tabular-nums">
                        {formatIndex(filteredMembers.length)}
                      </span>
                    </div>

                    <div
                      className={`grid gap-4 sm:gap-5 ${
                        usesThreeCols
                          ? 'max-w-[780px] grid-cols-1 sm:grid-cols-3'
                          : 'max-w-[540px] grid-cols-1 sm:grid-cols-2'
                      }`}
                    >
                      {filteredMembers.map((member, index) => {
                        const isFounder = member.group === 'founder';
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => handleSelectMemberCard(index)}
                            aria-label={`Inspect profile for ${member.name}, ${member.role}`}
                            className={`group flex min-w-0 cursor-pointer flex-col rounded-[14px] border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(6,26,18,0.09)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#063B27] ${
                              isFounder
                                ? 'border-[#C99E44]/55 bg-gradient-to-br from-[#FDFBF5] via-[#FAF4E4] to-[#F4EBDA] shadow-[0_10px_26px_rgba(107,79,20,0.07)] hover:border-[#B8892E]'
                                : 'border-[#063B27]/14 bg-gradient-to-br from-[#FCF9F2] via-[#FAF6EC] to-[#F4EFE2] shadow-[0_10px_24px_rgba(6,26,18,0.05)] hover:border-[#063B27]/35'
                            }`}
                          >
                            <div className="aspect-square w-full overflow-hidden rounded-[10px] bg-[#061a12] ring-1 ring-[#061a12]/10">
                              <PortraitAsset
                                member={member}
                                eager={index < 4}
                                hoverZoom
                              />
                            </div>

                            <div className="px-0.5 pt-3 pb-0.5">
                              <p className="text-[10px] leading-[1.35] font-bold tracking-[0.12em] text-[#6B4F14] uppercase">
                                {member.role}
                              </p>
                              <h3 className="mt-1 text-[15px] leading-[1.3] font-bold tracking-tight text-[#061a12] sm:text-base">
                                {member.name}
                              </h3>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.section>
                ) : (
                  <motion.article
                    key={selectedMember.id}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, x: slideDirection * 40 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, x: slideDirection * -40 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.16,
                      ease: 'easeOut',
                    }}
                    className={`rounded-[16px] border p-4 shadow-[0_20px_48px_rgba(6,26,18,0.07),0_2px_10px_rgba(107,79,20,0.05)] sm:p-6 md:grid md:grid-cols-12 md:items-center md:gap-8 md:p-7 lg:gap-10 lg:p-8 ${
                      selectedMember.group === 'founder'
                        ? 'border-[#C99E44]/55 bg-gradient-to-br from-[#FDFBF5] via-[#FAF4E4] to-[#F4EBDA]'
                        : 'border-[#063B27]/14 bg-gradient-to-br from-[#FCF9F2] via-[#FAF6EC] to-[#F4EFE2]'
                    }`}
                  >
                    {/* Left Portrait (~42% width on desktop, full-width square above on mobile) */}
                    <div className="md:col-span-5">
                      <div className="aspect-square w-full overflow-hidden rounded-[12px] bg-[#061a12] shadow-[0_12px_28px_rgba(6,26,18,0.14)] ring-1 ring-[#061a12]/10">
                        <PortraitAsset member={selectedMember} eager />
                      </div>
                    </div>

                    {/* Right Editorial Profile Details */}
                    <div className="mt-5 min-w-0 md:col-span-7 md:mt-0 md:flex md:flex-col md:justify-center">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-[1.4] font-bold tracking-wide sm:text-xs">
                        <span className="tracking-[0.09em] text-[#6B4F14] uppercase">
                          {selectedMember.role}
                        </span>
                        <span aria-hidden="true" className="text-[#8A6720]/60">
                          ·
                        </span>
                        <span className="font-semibold text-[#365647]">
                          {selectedMember.focusArea}
                        </span>
                      </div>

                      <h2 className="mt-2 text-2xl leading-[1.2] font-bold tracking-tight text-[#061a12] sm:text-3xl">
                        {selectedMember.name}
                      </h2>

                      <p className="mt-3.5 text-[15px] leading-[1.68] font-normal text-[#1E352B] sm:text-base">
                        {selectedMember.bio}
                      </p>

                      <blockquote className="mt-5 border-t border-[#8A6720]/25 pt-4 sm:mt-6 sm:pt-5">
                        <p className="font-editorial text-[17px] leading-[1.5] font-semibold italic text-[#6B4F14] sm:text-xl">
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
