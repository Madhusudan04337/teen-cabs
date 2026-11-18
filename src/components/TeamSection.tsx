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
import { gsap, Observer, useGSAP } from '../motion/setup';
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
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, [canGoPrev]);

  const handleNext = useCallback(() => {
    if (!canGoNext) return;
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
  const isAllView = activeCategory === 'all';

  // Touch & pointer swipe with Observer + InertiaPlugin snap-back on member spotlights
  useGSAP(
    () => {
      if (prefersReducedMotion || isAllView || filteredMembers.length <= 1) return;
      const target = spotlightWrapRef.current;
      if (!target) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let dragOffset = 0;

        const observer = Observer.create({
          target,
          type: 'touch,pointer',
          lockAxis: true,
          tolerance: 10,
          onDrag(self) {
            if (self.axis !== 'x') return;
            dragOffset = Math.max(-72, Math.min(72, dragOffset + self.deltaX));
            gsap.set(target, {
              x: dragOffset,
              rotation: dragOffset * 0.025,
            });
          },
          onDragEnd(self) {
            const velocity = self.velocityX;
            const current = dragOffset;
            dragOffset = 0;

            if ((current < -42 || velocity < -480) && canGoNext) {
              gsap.to(target, {
                x: 0,
                rotation: 0,
                duration: 0.22,
                ease: 'power2.out',
                clearProps: 'transform',
              });
              handleNext();
              return;
            }

            if ((current > 42 || velocity > 480) && canGoPrev) {
              gsap.to(target, {
                x: 0,
                rotation: 0,
                duration: 0.22,
                ease: 'power2.out',
                clearProps: 'transform',
              });
              handlePrev();
              return;
            }

            gsap.to(target, {
              x: 0,
              rotation: 0,
              duration: 0.32,
              ease: 'power2.out',
              clearProps: 'transform',
            });
          },
        });

        return () => {
          observer.kill();
          gsap.set(target, { clearProps: 'transform' });
        };
      });

      return () => mm.revert();
    },
    {
      scope: spotlightWrapRef,
      dependencies: [
        activeCategory,
        canGoNext,
        canGoPrev,
        filteredMembers.length,
        handleNext,
        handlePrev,
        isAllView,
        prefersReducedMotion,
      ],
    }
  );

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="relative z-10 overflow-x-clip bg-transparent py-12 sm:py-16 lg:py-24"
    >

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT SIDEBAR: Editorial Heading, 3-4 Line Description & Category Filter */}
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
              className="mt-4 max-w-[38ch] text-sm leading-[1.78] font-light text-[#D4E1D8] sm:text-[0.9375rem]"
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
                        ? 'glass-emerald border-[#d4af37]/45 text-[#E6C477]'
                        : 'glass-emerald text-[#D4E1D8] hover:border-[#d4af37]/30'
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
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#285640]/80 pb-3.5 sm:mb-8 sm:pb-4">
              <div className="flex items-center gap-2.5 font-mono text-xs tabular-nums">
                <span className="tracking-[0.12em] text-[#E6C477] uppercase">
                  {activeCategoryLabel}
                </span>
                <span aria-hidden="true" className="text-[#285640]">
                  /
                </span>
                {isAllView ? (
                  <span className="text-[#B7C8BA]">
                    {formatIndex(filteredMembers.length)} Members
                  </span>
                ) : (
                  <>
                    <span className="text-[#E8EEE8]">
                      {formatIndex(safeActiveIndex + 1)}
                    </span>
                    <span aria-hidden="true" className="text-[#B7C8BA]/60">
                      of
                    </span>
                    <span className="text-[#B7C8BA]">
                      {formatIndex(filteredMembers.length)}
                    </span>
                  </>
                )}
              </div>

              {!isAllView && filteredMembers.length > 1 && (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    aria-label="Previous team member"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#285640] text-[#E8EEE8] transition-colors duration-150 hover:border-[#E6C477] hover:text-[#E6C477] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    aria-label="Next team member"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#285640] text-[#E8EEE8] transition-colors duration-150 hover:border-[#E6C477] hover:text-[#E6C477] disabled:cursor-not-allowed disabled:opacity-35 sm:h-11 sm:w-11"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* VIEW SWITCH: All Members Grid vs Single Member Spotlight */}
            <div ref={spotlightWrapRef} aria-live="polite" className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {isAllView ? (
                  <motion.div
                    key="all-grid"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.12,
                      ease: 'easeOut',
                    }}
                    className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5"
                  >
                    {filteredMembers.map((member, index) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleInspectFromAll(member)}
                        aria-label={`View profile for ${member.name}, ${member.role}`}
                        className="group glass-emerald glass-emerald-hover relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl text-left shadow-lg shadow-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6C477]"
                      >
                        <PortraitAsset
                          member={member}
                          eager={index < 6}
                          compact
                        />

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#061a12]/92 via-[#061a12]/48 to-transparent"
                        />

                        <div className="absolute inset-x-3.5 bottom-3 sm:inset-x-4 sm:bottom-3.5">
                          <p className="truncate text-[10px] font-semibold tracking-[0.12em] text-[#E6C477] uppercase sm:text-[11px]">
                            {member.role}
                          </p>
                          <h2 className="mt-0.5 truncate text-sm font-semibold tracking-tight text-[#F3F0E6] sm:text-base">
                            {member.name}
                          </h2>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.article
                    key={selectedMember.id}
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.11,
                      ease: 'easeOut',
                    }}
                    className="glass-emerald grid grid-cols-1 items-stretch gap-6 rounded-3xl p-5 shadow-2xl shadow-black/35 sm:p-7 md:grid-cols-12 md:gap-8 lg:gap-10 lg:p-8"
                  >
                    {/* Featured Single Portrait */}
                    <div className="md:col-span-5">
                      <div className="mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#061a12]/60 shadow-xl shadow-black/30 md:mx-0 md:max-w-none">
                        <PortraitAsset member={selectedMember} eager />
                      </div>
                    </div>

                    {/* Editorial Profile & Pull Quote */}
                    <div className="flex flex-col justify-between md:col-span-7 md:py-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium tracking-wide text-[#B7C8BA]">
                          <span className="tracking-[0.12em] text-[#E6C477] uppercase">
                            {selectedMember.role}
                          </span>
                          <span aria-hidden="true" className="text-[#285640]">
                            ·
                          </span>
                          <span>{selectedMember.focusArea}</span>
                        </div>

                        <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-[#F3F0E6] sm:text-3xl lg:text-[2.25rem]">
                          {selectedMember.name}
                        </h2>

                        <p className="mt-4 max-w-[48ch] text-sm leading-[1.78] font-light text-[#D4E1D8] sm:text-base sm:leading-[1.8]">
                          {selectedMember.bio}
                        </p>
                      </div>

                      <blockquote className="mt-7 border-t border-[#d4af37]/15 pt-5 sm:mt-8 sm:pt-6">
                        <p className="font-editorial text-lg leading-[1.45] italic text-[#E6C477] sm:text-xl">
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
