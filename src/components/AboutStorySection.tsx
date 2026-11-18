import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import aboutTeenCommuteImg from '../assets/images/about_teen_commute_1794994192564.jpg';
import { gsap, useGSAP } from '../motion/setup';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
} from '../motion/tokens';
import { useLenis } from '../motion/LenisContext';

const ENGINEERING_JOURNEY = [
  {
    step: '01',
    title: 'Parent-linked supervision',
    description:
      'One-tap trip sign-offs, live corridor alerts, and transparent ETA visibility from pickup to arrival.',
  },
  {
    step: '02',
    title: 'Verified driver identity',
    description:
      'Background screening, pre-pickup identity checks, and trained chauffeurs dedicated to student commutes.',
  },
  {
    step: '03',
    title: 'Connected teen mobility',
    description:
      'Two-tap booking, saved cabin preferences, and 24/7 dispatch telemetry unified inside one calm flow.',
  },
] as const;

export function AboutStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useLenis();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offsetX = isDesktop ? MOTION_DISTANCE.desktopX : MOTION_DISTANCE.mobileX;
        const offsetY = isDesktop ? MOTION_DISTANCE.desktopY : MOTION_DISTANCE.mobileY;

        // Editorial opening reveal on mount
        const heroEls = gsap.utils.toArray<HTMLElement>('[data-story-hero]', root);
        if (heroEls.length > 0) {
          gsap.fromTo(
            heroEls,
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

        const heroPhoto = root.querySelector<HTMLElement>('[data-hero-illustration]');
        if (heroPhoto) {
          gsap.fromTo(
            heroPhoto,
            { y: offsetY * 0.65, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              delay: 0.14,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
            }
          );
        }

        // Narrative copy reveal
        gsap.utils.toArray<HTMLElement>('[data-story-left]', root).forEach((el) => {
          gsap.fromTo(
            el,
            {
              x: isDesktop ? -offsetX : 0,
              y: isDesktop ? 0 : offsetY,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: el,
                start: 'top 86%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });

        // Vertical dropping journey line reveal
        const journeyLine = root.querySelector<HTMLElement>('[data-journey-line]');
        if (journeyLine) {
          gsap.fromTo(
            journeyLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'top center',
              duration: 1.05,
              ease: MOTION_EASE.gentle,
              clearProps: 'transform',
              scrollTrigger: {
                trigger: '[data-arch-diagram]',
                start: 'top 84%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>('[data-journey-stop]', root).forEach((stop, idx) => {
          gsap.fromTo(
            stop,
            { y: offsetY * 0.7, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: 0.1 + idx * 0.12,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: '[data-arch-diagram]',
                start: 'top 84%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-manifesto-item]', root).forEach((item, idx) => {
          gsap.fromTo(
            item,
            { y: offsetY, opacity: 0, clipPath: 'inset(12% 0 12% 0)' },
            {
              y: 0,
              opacity: 1,
              clipPath: 'inset(0% 0 0% 0)',
              duration: 0.95,
              delay: idx * 0.12,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity,clip-path',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
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
      id="about-story"
      ref={sectionRef}
      aria-labelledby="about-story-heading"
      className="relative z-10 overflow-x-clip bg-[#063B27]"
    >
      {/* 1. EDITORIAL INTRODUCTION WITH UNBOXED PHOTOGRAPHY */}
      <div className="relative py-14 sm:py-18 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.09)_0%,transparent_66%)] sm:h-[540px] sm:w-[540px]"
        />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-14">
            {/* Left Column: Editorial Opening Copy */}
            <div className="min-w-0 md:col-span-6">
              <p
                data-story-hero
                className="mb-4 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm"
              >
                Our brand story
              </p>

              <h1
                id="about-story-heading"
                data-story-hero
                className="text-balance text-4xl leading-[1.06] font-semibold tracking-[-0.03em] text-[#E8EEE8] sm:text-5xl lg:text-[3.75rem]"
              >
                Built for families.{' '}
                <span className="font-editorial block font-normal italic text-[#E6C477]">
                  Driven by trust.
                </span>
              </h1>

              <p
                data-story-hero
                className="mt-6 max-w-[50ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]"
              >
                Teen Cabs is a Forgeit Groups product created in Chennai with a
                clear purpose: daily rides to school, tuition, coaching, and
                weekend activities deserve infrastructure built specifically for
                teenagers and the parents who support them.
              </p>

              {/* Understated Editorial Signature */}
              <div
                data-story-hero
                className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#285640] pt-6 text-xs tracking-wide sm:text-sm"
              >
                <span className="font-medium text-[#E6C477]">
                  A Forgeit Product
                </span>
                <span aria-hidden="true" className="text-[#285640]">
                  ·
                </span>
                <span className="font-mono text-xs text-[#B7C8BA]">
                  Built Strong. Built Online.
                </span>
              </div>
            </div>

            {/* Right Column: Clean Unboxed Chennai Commute Photography */}
            <figure data-hero-illustration className="min-w-0 md:col-span-6">
              <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
                <img
                  src={aboutTeenCommuteImg}
                  alt="Teenager with a backpack stepping safely out of a silver sedan along a sunlit tree-lined street in Chennai"
                  className="aspect-[3/2] w-full object-cover object-center"
                />
              </div>
              <figcaption className="mt-3.5 flex items-center justify-between gap-4 text-xs text-[#B7C8BA]">
                <span>Chennai · Everyday student commutes</span>
                <span className="font-mono text-[#E6C477]">School &amp; coaching</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* 2. ENGINEERED FROM THE GROUND UP — OPEN DROPPING JOURNEY FLOW */}
      <div className="relative border-t border-[#285640] bg-[#032A1D] py-16 sm:py-22 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_72%_50%,rgba(11,73,51,0.52),transparent_72%)]"
        />

        <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10">
          {/* Left: Engineering Rationale Narrative */}
          <div data-story-left className="lg:col-span-5">
            <p className="mb-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
              Why purpose-built matters
            </p>
            <h2 className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[2.625rem]">
              Engineered from the{' '}
              <span className="font-editorial font-normal italic text-[#E6C477]">
                ground up.
              </span>
            </h2>

            <p className="mt-6 max-w-[46ch] text-base leading-[1.78] font-light text-[#D4E1D8]">
              Rather than adapting generic adult ride-hailing apps, Forgeit
              designed Teen Cabs as a continuous journey connecting parents,
              vetted drivers, and teen riders from pickup to arrival.
            </p>

            <div className="mt-8">
              <Link
                to="/features"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#285640] bg-[#063B27] px-5 py-2.5 text-sm font-medium text-[#E6C477] transition-colors duration-200 hover:border-[#D9B45B] hover:bg-[#0B4933]"
              >
                <span>Explore safety features</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: Open Dropping Gold Journey Line (zero container boxes) */}
          <div data-arch-diagram className="relative lg:col-span-6 lg:col-start-7">
            <div className="relative pl-9 sm:pl-11">
              {/* Subtle dashed route track + gold dropping progress line */}
              <div
                aria-hidden="true"
                className="absolute top-3 bottom-3 left-[11px] w-px border-l border-dashed border-[#285640]"
              />
              <div
                aria-hidden="true"
                data-journey-line
                className="absolute top-3 bottom-3 left-[11px] w-[2px] -translate-x-[0.5px] bg-gradient-to-b from-[#E6C477] via-[#D9B45B] to-[#E6C477]/25"
              />

              <ol className="space-y-10 sm:space-y-12">
                {ENGINEERING_JOURNEY.map((item) => (
                  <li key={item.step} data-journey-stop className="relative">
                    {/* Route node marker anchored cleanly on the dropping line */}
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-9 flex h-6 w-6 items-center justify-center rounded-full border border-[#E6C477]/65 bg-[#032A1D] sm:-left-11"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#E6C477]" />
                    </span>

                    <p className="font-mono text-xs font-medium tracking-[0.14em] text-[#E6C477] tabular-nums">
                      {item.step}
                    </p>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-[#E8EEE8]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-sm leading-[1.7] font-light text-[#D4E1D8] sm:text-base">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MISSION & VISION MANIFESTO (Asymmetric Editorial Spread) */}
      <div className="relative border-t border-[#285640] bg-[#063B27] py-18 sm:py-24 lg:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.07)_0%,transparent_70%)] sm:h-[460px] sm:w-[460px]"
        />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
            {/* Asymmetric Statement 01 — Our Mission */}
            <article
              data-manifesto-item
              aria-labelledby="mission-heading"
              className="lg:col-span-6"
            >
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-[#E6C477] sm:text-sm">
                <span className="font-mono tabular-nums">01</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#D9B45B]/55" />
                <span>Our mission</span>
              </div>

              <h2
                id="mission-heading"
                className="mt-5 text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[2.75rem]"
              >
                Supervised mobility{' '}
                <span className="font-editorial block font-normal italic text-[#E6C477]">
                  without friction
                </span>
              </h2>

              <p className="mt-6 max-w-[46ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
                To make everyday teen commutes predictable, transparent, and
                dependable — uniting parent-linked approvals, background-verified
                drivers, and live corridor telemetry in an experience teens
                genuinely enjoy using.
              </p>
            </article>

            {/* Asymmetric Statement 02 — Our Vision */}
            <article
              data-manifesto-item
              aria-labelledby="vision-heading"
              className="border-t border-[#D9B45B]/30 pt-10 lg:col-span-5 lg:col-start-8 lg:mt-24 lg:border-t-0 lg:pt-0"
            >
              <div className="hidden h-px w-full bg-gradient-to-r from-[#D9B45B]/50 via-[#285640] to-transparent lg:mb-10 lg:block" />

              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
                <span className="font-mono text-[#E6C477] tabular-nums">02</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#285640]" />
                <span>Our vision</span>
              </div>

              <h2
                id="vision-heading"
                className="mt-5 text-balance font-editorial text-3xl leading-[1.14] font-normal italic tracking-[-0.015em] text-[#F3F0E6] sm:text-4xl lg:text-[2.5rem]"
              >
                Confident independence{' '}
                <span className="font-sans block font-semibold not-italic text-[#E6C477]">
                  for every family
                </span>
              </h2>

              <p className="mt-6 max-w-[44ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
                To establish a trusted, teen-dedicated mobility standard across
                modern cities — giving families calm visibility at every step
                while empowering the next generation to move safely toward
                their world.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
