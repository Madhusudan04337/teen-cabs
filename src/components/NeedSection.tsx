import { memo, useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { BIGGER_PICTURE_STATS, NEED_ITEMS } from '../data/teenCabsData';
import { gsap, useGSAP } from '../motion/setup';

const SmoothPercentageStat = memo(function SmoothPercentageStat({
  target,
  prefersReducedMotion,
}: {
  target: number;
  prefersReducedMotion: boolean | null;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const hasCountedRef = useRef(false);
  const [value, setValue] = useState<number>(() => (prefersReducedMotion ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion) {
      hasCountedRef.current = true;
      setValue(target);
    }
  }, [prefersReducedMotion, target]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = wrapRef.current;
        if (!el) return;

        if (hasCountedRef.current) {
          setValue(target);
          return;
        }

        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 0.85,
          ease: 'sine.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
            onEnter: () => {
              hasCountedRef.current = true;
            },
          },
          onUpdate: () => {
            setValue(Math.round(counter.val));
          },
          onComplete: () => {
            hasCountedRef.current = true;
            setValue(target);
          },
        });
      });

      return () => {
        if (hasCountedRef.current) setValue(target);
        mm.revert();
      };
    },
    { scope: wrapRef, dependencies: [prefersReducedMotion, target] }
  );

  return (
    <span
      ref={wrapRef}
      className="font-editorial relative inline-block shrink-0 pr-1 text-6xl leading-none font-normal italic tabular-nums text-[#E6C477] sm:text-7xl lg:text-[5.5rem]"
    >
      <span aria-hidden="true" className="invisible select-none">
        00%
      </span>
      <span className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap">
        {value}%
      </span>
    </span>
  );
});

interface NeedSectionProps {
  compact?: boolean;
}

export function NeedSection({ compact = false }: NeedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState<string>(NEED_ITEMS[0].id);

  const primaryStat = BIGGER_PICTURE_STATS[0];
  const riskStat = BIGGER_PICTURE_STATS[1];
  const volumeStat = BIGGER_PICTURE_STATS[2];
  const supervisionStat = BIGGER_PICTURE_STATS[3];

  const statTrackRef = useRef<HTMLDivElement>(null);
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  const statsList = [
    {
      stat: primaryStat,
      desc: 'Purpose-built for teen commutes and parental peace of mind.',
      gold: true,
    },
    {
      stat: riskStat,
      desc: 'Safety risk comparison vs adult ride-hailing apps.',
      gold: false,
    },
    {
      stat: volumeStat,
      desc: 'Estimated annual rides required for youth commutes.',
      gold: false,
    },
    {
      stat: supervisionStat,
      desc: 'Parents want active ride supervision and real-time verification.',
      gold: true,
    },
  ];

  const handleStatScroll = () => {
    const track = statTrackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    const card = track.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 230;
    const idx = Math.round(scrollLeft / (cardWidth + 12));
    setActiveStatIndex(Math.min(3, Math.max(0, idx)));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 24 : 14;

        gsap.utils.toArray<HTMLElement>('[data-need-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: offset, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="the-need"
      ref={sectionRef}
      aria-labelledby="need-heading"
      className={`relative z-10 overflow-x-clip border-t border-[#d4af37]/12 bg-[#061a12]/25 ${
        compact ? 'py-16 sm:py-20 lg:py-24' : 'py-20 sm:py-24 lg:py-28'
      }`}
    >

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        {/* SECTION HEADER */}
        <div data-need-reveal className="mb-10 max-w-3xl sm:mb-12 lg:mb-14">
          <p className="mb-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
            Why we are building this
          </p>
          <h2
            id="need-heading"
            className="text-balance text-3xl leading-[1.08] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[3.25rem]"
          >
            Growing up means{' '}
            <span className="font-editorial block font-normal italic text-[#E6C477]">
              going places.
            </span>
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-[1.75] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
            Teenagers need everyday mobility to grow into independent adults,
            yet they are left navigating adult-oriented apps and unvetted transit.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT: 3 Problem Items (Left) vs 73% & Metrics Bento (Right) */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
          {/* LEFT: 3 Problem Accordion Cards */}
          <div data-need-reveal className="lg:col-span-6">
            <div className="flex items-center gap-3 border-b border-[#285640] pb-3 text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
              <span>The Current Reality</span>
              <span aria-hidden="true" className="text-[#285640]">·</span>
              <span className="font-mono text-[#B7C8BA]">03 Key Gaps</span>
            </div>

            <div className="mt-5 space-y-3.5">
              {NEED_ITEMS.map((item, idx) => {
                const isOpen = activeItem === item.id;
                const stepNum = `0${idx + 1}`;

                return (
                  <div
                    key={item.id}
                    className={`glass-emerald overflow-hidden rounded-2xl transition-all duration-200 ${
                      isOpen
                        ? 'border-[#d4af37]/45 shadow-lg shadow-black/25'
                        : 'glass-emerald-hover'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveItem(isOpen ? '' : item.id)}
                      aria-expanded={isOpen}
                      className="flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        <span
                          className={`font-mono text-sm font-semibold tabular-nums transition-colors duration-200 ${
                            isOpen ? 'text-[#E6C477]' : 'text-[#B7C8BA]/70'
                          }`}
                        >
                          {stepNum}
                        </span>
                        <h3
                          className={`text-base font-semibold tracking-tight transition-colors duration-200 sm:text-lg ${
                            isOpen ? 'text-[#F3F0E6]' : 'text-[#E8EEE8]'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          isOpen
                            ? 'border-[#E6C477]/60 bg-[#E6C477]/15 text-[#E6C477] rotate-180'
                            : 'border-[#285640] bg-[#063B27] text-[#B7C8BA]'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                        >
                          <div className="border-t border-[#285640]/60 px-5 pt-3 pb-5 sm:px-6">
                            <p className="text-sm leading-[1.72] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: 73% Hero Stat Card + Metrics Bento */}
          <div data-need-reveal className="space-y-4 lg:col-span-6">
            {/* 73% Hero Callout Card */}
            <div className="glass-emerald relative overflow-hidden rounded-2xl p-6 shadow-xl shadow-black/25 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <SmoothPercentageStat
                  target={73}
                  prefersReducedMotion={prefersReducedMotion}
                />
                <div className="min-w-0">
                  <h3 className="font-editorial text-xl leading-[1.3] font-normal italic text-[#F3F0E6] sm:text-2xl">
                    “of parents worry about teen transport safety every day”
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#B7C8BA] sm:text-sm">
                    Getting to school, tuition, or coaching shouldn't mean compromising on safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics: Horizontal Swipeable Snap-Carousel on Mobile, 2x2 Bento on Tablet/Desktop */}
            <div className="relative">
              <div
                ref={statTrackRef}
                onScroll={handleStatScroll}
                className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
              >
                {statsList.map((item) => (
                  <div
                    key={item.stat.label}
                    className="glass-emerald glass-emerald-hover w-[72vw] max-w-[250px] shrink-0 snap-start rounded-xl p-4 sm:w-auto sm:max-w-none sm:p-5"
                  >
                    <span
                      className={`font-mono text-2xl font-semibold sm:text-3xl ${
                        item.gold ? 'text-[#E6C477]' : 'text-[#F3F0E6]'
                      }`}
                    >
                      {item.stat.value}
                    </span>
                    <h4 className="mt-1.5 text-xs font-semibold text-[#E8EEE8] sm:text-sm">
                      {item.stat.label}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#B7C8BA] sm:text-xs">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile pagination indicator dots */}
              <div
                aria-hidden="true"
                className="mt-2.5 flex items-center justify-center gap-1.5 sm:hidden"
              >
                {statsList.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeStatIndex === i
                        ? 'w-4 bg-[#E6C477]'
                        : 'w-1 bg-[#285640]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
