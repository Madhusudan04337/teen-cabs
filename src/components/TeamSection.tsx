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
        className="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.05]"
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
          compact ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-28 w-28'
        }`}
      >
        <span
          className={`font-editorial font-normal italic text-[#E6C477] ${
            compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
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

  // Truly randomized & asymmetric background shape positions and sizes for each member
  const accentVariations = useMemo(
    () => [
      { c1: 'top-1 -left-4 h-20 w-20 bg-[#063B27]/30', c2: 'bottom-0 right-2 h-16 w-16 bg-[#E6C477]/45' },
      { c1: '-top-3 right-0 h-22 w-22 bg-[#84A98C]/35', c2: 'bottom-2 -left-3 h-14 w-14 bg-[#063B27]/25' },
      { c1: 'top-2 -left-3 h-18 w-18 bg-[#E6C477]/40', c2: '-bottom-3 right-1 h-20 w-20 bg-[#063B27]/30' },
      { c1: '-top-2 -left-2 h-24 w-24 bg-[#063B27]/25', c2: 'bottom-1 right-0 h-16 w-16 bg-[#84A98C]/40' },
      { c1: 'top-0 right-2 h-20 w-20 bg-[#E6C477]/40', c2: '-bottom-2 -left-3 h-22 w-22 bg-[#063B27]/30' },
      { c1: '-top-4 left-2 h-16 w-16 bg-[#84A98C]/40', c2: 'bottom-2 -right-3 h-20 w-20 bg-[#063B27]/30' },
    ],
    []
  );

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative z-10 min-h-[calc(100vh-5rem)] overflow-x-clip bg-transparent py-12 text-[#063B27] sm:py-16 lg:py-24"
    >
      {/* Large soft organic backdrop shape matching reference slide */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[#E5E0D4]/85 via-[#EAE5D9]/50 to-transparent blur-3xl sm:h-[700px] sm:w-[700px] lg:right-[-5%] lg:top-[-2%]"
      />

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT SIDEBAR: Editorial Heading, 3-4 Line Description & Category Filter */}
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
              className="mt-4 max-w-[38ch] text-sm leading-[1.78] font-normal text-[#061a12] sm:text-[0.9375rem]"
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
                        ? 'border-[#8A6720] bg-[#E6C477]/25 px-3 rounded-lg text-[#061a12] font-bold'
                        : 'border-[#A8A08A] text-[#061a12] hover:border-[#8A6720] hover:text-[#061a12]'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold tracking-wide whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className={`h-px transition-all duration-200 ${
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
                          ? 'text-[#6B4F14] font-bold'
                          : 'text-[#365647] group-hover:text-[#061a12]'
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
                    className={`inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? 'border-[#8A6720] bg-[#063B27] text-[#FFFDF7]'
                        : 'border-[#A8A08A] bg-[#FFFDF7] text-[#061a12] hover:border-[#8A6720]'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="font-mono text-[10px] opacity-90 tabular-nums">
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
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#A8A08A] pb-3.5 sm:mb-8 sm:pb-4">
              <div className="flex items-center gap-2.5 font-mono text-xs font-semibold tabular-nums">
                <span className="tracking-[0.12em] text-[#6B4F14] uppercase">
                  {activeCategoryLabel}
                </span>
                <span aria-hidden="true" className="text-[#695F46]">
                  /
                </span>
                {isDirectoryView ? (
                  <span className="text-[#061a12]">
                    {formatIndex(filteredMembers.length)} Members
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

              {isSpotlight && filteredMembers.length > 1 && (
                <div className="flex items-center gap-2.5">
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
                          <div className="mb-4 flex items-center gap-3 border-b border-[#A8A08A] pb-3">
                            <h2
                              id={`${category.id}-team-heading`}
                              className="font-editorial text-2xl font-bold italic text-[#061a12] sm:text-3xl"
                            >
                              {category.label}
                            </h2>
                            <span className="font-mono text-xs font-semibold text-[#365647] tabular-nums">
                              {formatIndex(members.length)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
                            {members.map((member, index) => {
                              const isFounder = member.group === 'founder';
                              const accent = accentVariations[index % accentVariations.length];

                              return (
                                <button
                                  key={member.id}
                                  type="button"
                                  onClick={() => handleInspectFromAll(member)}
                                  aria-label={`View profile for ${member.name}, ${member.role}`}
                                  className="group relative flex min-w-0 items-center gap-6 rounded-2xl p-4 text-left transition-all duration-300 hover:bg-[#EAE5D9]/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#063B27] sm:p-5"
                                >
                                  {/* Circular Portrait with Randomized & Asymmetric Background Shapes */}
                                  <div className="relative shrink-0">
                                    {/* Background Accent Shape 1 */}
                                    <div
                                      aria-hidden="true"
                                      className={`absolute rounded-full transition-transform duration-300 group-hover:scale-110 ${accent.c1}`}
                                    />
                                    {/* Background Accent Shape 2 */}
                                    <div
                                      aria-hidden="true"
                                      className={`absolute rounded-full transition-transform duration-300 group-hover:scale-110 ${accent.c2}`}
                                    />

                                    {/* Main Clean Circular Portrait Avatar */}
                                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white bg-[#061a12] shadow-xl sm:h-32 sm:w-32">
                                      <PortraitAsset
                                        member={member}
                                        eager={index < 6}
                                        compact
                                      />
                                    </div>
                                  </div>

                                  {/* Card Text Content: High Contrast Name, Designation & Bio */}
                                  <div className="min-w-0 flex-1 py-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-[11px] font-bold tracking-[0.14em] text-[#6B4F14] uppercase sm:text-xs">
                                        {member.role}
                                      </p>
                                      {isFounder && (
                                        <span className="inline-flex items-center rounded-full bg-[#063B27] px-2 py-0.5 text-[9px] font-bold text-[#E6C477]">
                                          Founder
                                        </span>
                                      )}
                                    </div>

                                    <h3 className="mt-1 truncate text-lg font-bold tracking-tight text-[#061a12] sm:text-xl">
                                      {member.name}
                                    </h3>

                                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-normal text-[#061a12] sm:text-sm">
                                      {member.bio}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })}
                  </motion.div>
                ) : (() => {
                  const isFounderSpotlight = selectedMember.group === 'founder';
                  return (
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
                      className="grid grid-cols-1 gap-6 rounded-2xl p-5 md:grid-cols-12 md:items-stretch md:gap-8 md:p-8 lg:gap-10 lg:p-10"
                    >
                      {/* Featured Single Portrait with Natural Asymmetric Shapes */}
                      <div className="md:col-span-5 flex items-center justify-center">
                        <div className="relative aspect-square w-52 sm:w-60 md:w-full md:max-w-[280px]">
                          {/* Background Accent Shape 1 */}
                          <div
                            aria-hidden="true"
                            className="absolute -top-6 -left-4 h-36 w-36 rounded-full bg-[#063B27]/25 sm:h-44 sm:w-44"
                          />
                          {/* Background Accent Shape 2 */}
                          <div
                            aria-hidden="true"
                            className="absolute -bottom-4 -right-6 h-32 w-32 rounded-full bg-[#E6C477]/50 sm:h-40 sm:w-40"
                          />
                          {/* Main Circular Portrait */}
                          <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-[#061a12] shadow-2xl">
                            <PortraitAsset member={selectedMember} eager />
                          </div>
                        </div>
                      </div>

                      {/* Editorial Profile & Pull Quote */}
                      <div className="min-w-0 md:col-span-7 md:flex md:flex-col md:justify-between md:py-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs leading-tight font-bold tracking-wide">
                            <span className="tracking-[0.08em] text-[#6B4F14] uppercase">
                              {selectedMember.role}
                            </span>
                            <span aria-hidden="true" className="text-[#695F46]">
                              ·
                            </span>
                            <span className="text-[#365647] font-semibold">{selectedMember.focusArea}</span>
                          </div>

                          <h2 className="mt-2 text-2xl leading-tight font-bold tracking-tight text-[#061a12] sm:text-3xl md:text-4xl">
                            {selectedMember.name}
                          </h2>

                          <p className="mt-4 max-w-[48ch] text-sm leading-[1.75] font-normal text-[#061a12] sm:text-base">
                            {selectedMember.bio}
                          </p>
                        </div>

                        <blockquote className="mt-6 border-t border-[#A8A08A] pt-5 lg:mt-8 lg:pt-6">
                          <p className="font-editorial text-lg leading-[1.5] italic font-semibold text-[#6B4F14] sm:text-xl">
                            “{selectedMember.quote}”
                          </p>
                        </blockquote>
                      </div>
                    </motion.article>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
