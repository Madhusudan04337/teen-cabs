import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/setup';
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
} from '../motion/tokens';
import { useLenis } from '../motion/LenisContext';

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

        // Restrained fade/scale entrance for "The Connected Journey" card
        const heroIllustration = root.querySelector<HTMLElement>(
          '[data-hero-illustration]'
        );
        if (heroIllustration) {
          gsap.fromTo(
            heroIllustration,
            { scale: 0.96, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              delay: 0.12,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
            }
          );
        }

        const heroCorridorGlow = root.querySelector<SVGPathElement>(
          '[data-hero-corridor-glow]'
        );
        if (heroCorridorGlow) {
          gsap.fromTo(
            heroCorridorGlow,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.9,
              delay: 0.35,
              ease: MOTION_EASE.gentle,
              clearProps: 'opacity',
            }
          );
        }

        const heroCorridors = gsap.utils.toArray<SVGPathElement>(
          '[data-hero-corridor]',
          root
        );
        heroCorridors.forEach((path, idx) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.15,
            delay: 0.25 + idx * 0.12,
            ease: MOTION_EASE.gentle,
          });
        });

        const heroNodes = gsap.utils.toArray<SVGGElement>('[data-hero-node]', root);
        if (heroNodes.length > 0) {
          gsap.fromTo(
            heroNodes,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.55,
              delay: 0.48,
              stagger: 0.14,
              transformOrigin: 'center center',
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
            }
          );
        }

        const heroLabels = gsap.utils.toArray<SVGTextElement>('[data-hero-label]', root);
        if (heroLabels.length > 0) {
          gsap.fromTo(
            heroLabels,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.45,
              delay: 0.58,
              stagger: 0.14,
              ease: MOTION_EASE.gentle,
              clearProps: 'opacity',
            }
          );
        }

        // Scroll-triggered alternating directional reveals (once-only, clean prop cleanup)
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

        gsap.utils.toArray<HTMLElement>('[data-story-right]', root).forEach((el) => {
          gsap.fromTo(
            el,
            {
              x: isDesktop ? offsetX : 0,
              y: isDesktop ? 0 : offsetY,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: MOTION_DURATION.reveal,
              delay: 0.08,
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

        gsap.utils.toArray<HTMLElement>('[data-story-pillar]', root).forEach((pillar, idx) => {
          gsap.fromTo(
            pillar,
            { y: offsetY * 0.7, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: idx * 0.08,
              ease: MOTION_EASE.editorial,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: pillar,
                start: 'top 90%',
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

        // Subtle SVG corridor path draw in the Brand Story illustration
        const architecturePaths = gsap.utils.toArray<SVGPathElement>(
          '[data-arch-path]',
          root
        );
        architecturePaths.forEach((path, idx) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.15,
            delay: 0.15 + idx * 0.15,
            ease: MOTION_EASE.gentle,
            scrollTrigger: {
              trigger: '[data-arch-diagram]',
              start: 'top 84%',
              toggleActions: 'play none none none',
              once: true,
            },
          });
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
      {/* 1. EDITORIAL INTRODUCTION */}
      <div className="relative py-14 sm:py-18 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.09)_0%,transparent_66%)] sm:h-[540px] sm:w-[540px]"
        />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.22fr_1fr] md:gap-10 lg:gap-14">
            {/* Left Column (~55%): Editorial Opening Copy */}
            <div className="min-w-0">
              <p
                data-story-hero
                className="mb-4 text-xs font-medium tracking-wide text-[#D4E1D8] sm:text-sm"
              >
                Our brand story
              </p>

              <h1
                id="about-story-heading"
                data-story-hero
                className="text-balance text-4xl leading-[1.06] font-semibold tracking-[-0.03em] text-[#E8EEE8] sm:text-5xl lg:text-[3.875rem]"
              >
                Built for families.{' '}
                <span className="font-editorial block font-normal italic text-[#E6C477]">
                  Driven by trust.
                </span>
              </h1>

              <p
                data-story-hero
                className="mt-7 max-w-[52ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]"
              >
                Teen Cabs is a Forgeit Groups product created in Chennai with a
                clear purpose: daily rides to school, tuition, coaching, and
                weekend activities deserve infrastructure built specifically for
                teenagers and the parents who support them.
              </p>

              {/* Understated Editorial Signature */}
              <div
                data-story-hero
                className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#285640] pt-6 text-xs tracking-wide sm:text-sm"
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

            {/* Right Column (~45%): Architectural Preview Card — "The Connected Journey" */}
            <div data-hero-illustration className="min-w-0">
              <figure className="relative flex flex-col overflow-hidden rounded-[24px] border border-[rgba(230,196,119,0.22)] bg-[#063B27] p-6 shadow-[0_24px_60px_-18px_rgba(1,16,11,0.72)] sm:p-7 lg:aspect-[11/10] lg:p-8">
                {/* Horizontal Card Header Bar */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 border-b border-[rgba(230,196,119,0.18)] pb-4">
                  <figcaption className="font-editorial text-[1.375rem] leading-tight font-normal italic text-[#F3F0E6] sm:text-[1.5rem] lg:text-[1.625rem]">
                    The Connected Journey
                  </figcaption>
                  <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-[#B7C8BA] uppercase sm:text-[11px]">
                    SAFE CORRIDOR ARCHITECTURE
                  </span>
                </div>

                {/* Main Architectural Schematic Viewport */}
                <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#285640]/50 bg-[#032A1D]">
                  <svg
                    viewBox="0 0 460 330"
                    preserveAspectRatio="xMidYMid meet"
                    className="block h-full w-full"
                    role="img"
                    aria-label="Architectural schematic titled The Connected Journey depicting a translucent protective shield watermark centered behind a rising gold mobility corridor connecting Origin to Arrival."
                  >
                    <defs>
                      <radialGradient id="schematicAmbient" cx="52%" cy="48%" r="55%">
                        <stop offset="0%" stopColor="#0B4933" stopOpacity="0.6" />
                        <stop offset="68%" stopColor="#063B27" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#032A1D" stopOpacity="0" />
                      </radialGradient>
                      <filter id="routeGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                      </filter>
                    </defs>

                    {/* Base Dark Emerald Surface & Ambient Illumination */}
                    <rect width="460" height="330" fill="#032A1D" />
                    <circle cx="236" cy="164" r="190" fill="url(#schematicAmbient)" />

                    {/* Fine Dark-Green Architectural Grid Lines */}
                    <g fill="none" stroke="#0B4933" strokeOpacity="0.72" strokeWidth="1">
                      <line x1="0" y1="66" x2="460" y2="66" />
                      <line x1="0" y1="132" x2="460" y2="132" />
                      <line x1="0" y1="198" x2="460" y2="198" />
                      <line x1="0" y1="264" x2="460" y2="264" />
                      <line x1="92" y1="0" x2="92" y2="330" />
                      <line x1="184" y1="0" x2="184" y2="330" />
                      <line x1="276" y1="0" x2="276" y2="330" />
                      <line x1="368" y1="0" x2="368" y2="330" />
                    </g>

                    {/* Low-Opacity Architectural Map / Corridor Geometry */}
                    <g fill="none" stroke="#285640" strokeOpacity="0.32" strokeWidth="1">
                      <path d="M -10 218 L 164 188 L 320 232 L 470 198" />
                      <path d="M 48 330 L 140 144 L 284 84 L 418 0" />
                      <path d="M 24 106 Q 190 78, 444 128" />
                      <circle cx="230" cy="166" r="138" strokeDasharray="3 6" opacity="0.65" />
                      <rect x="116" y="88" width="54" height="34" rx="5" />
                      <rect x="296" y="210" width="60" height="38" rx="5" />
                    </g>

                    {/* Large Translucent Shield Watermark Behind the Route */}
                    <g transform="translate(230, 166)">
                      <path
                        d="M 0 -88 L 72 -58 V -4 C 72 44 40 82 0 100 C -40 82 -72 44 -72 -4 V -58 Z"
                        fill="#0B4933"
                        fillOpacity="0.2"
                        stroke="#E6C477"
                        strokeOpacity="0.16"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 0 -70 L 54 -46 V -5 C 54 33 29 63 0 78 C -29 63 -54 33 -54 -5 V -46 Z"
                        fill="none"
                        stroke="#285640"
                        strokeOpacity="0.48"
                        strokeWidth="1"
                        strokeLinejoin="round"
                      />
                      {/* Subtle centered checkmark silhouette at watermark opacity */}
                      <path
                        d="M -15 4 L -5 14 L 16 -10"
                        fill="none"
                        stroke="#E6C477"
                        strokeOpacity="0.16"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* Under-track guide line for crisp depth */}
                    <path
                      d="M 88 250 C 154 242, 186 192, 232 164 C 278 136, 316 102, 372 82"
                      fill="none"
                      stroke="#285640"
                      strokeOpacity="0.55"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Subtle Secondary Gold Glow Beneath Route */}
                    <g data-hero-corridor-glow>
                      <path
                        d="M 88 250 C 154 242, 186 192, 232 164 C 278 136, 316 102, 372 82"
                        fill="none"
                        stroke="#E6C477"
                        strokeOpacity="0.28"
                        strokeWidth="10"
                        strokeLinecap="round"
                        filter="url(#routeGlowFilter)"
                      />
                      <path
                        d="M 88 250 C 154 242, 186 192, 232 164 C 278 136, 316 102, 372 82"
                        fill="none"
                        stroke="#D9B45B"
                        strokeOpacity="0.34"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Primary Smooth Rising Gold Route */}
                    <path
                      data-hero-corridor
                      d="M 88 250 C 154 242, 186 192, 232 164 C 278 136, 316 102, 372 82"
                      fill="none"
                      stroke="#E6C477"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                    />

                    {/* Origin Endpoint (Lower-Left): Small Gold Circular Marker + ORIGIN Label */}
                    <g transform="translate(88, 250)">
                      <g data-hero-node>
                        <circle r="13" fill="#E6C477" fillOpacity="0.16" stroke="#E6C477" strokeOpacity="0.45" strokeWidth="1" />
                        <circle r="6.5" fill="#E6C477" stroke="#032A1D" strokeWidth="1.5" />
                        <circle r="2.2" fill="#F3F0E6" />
                      </g>
                      <text
                        data-hero-label
                        x="0"
                        y="31"
                        textAnchor="middle"
                        fill="#B7C8BA"
                        fontSize="11.5"
                        fontWeight="500"
                        letterSpacing="1.6"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        ORIGIN
                      </text>
                    </g>

                    {/* Arrival Endpoint (Upper-Right): Larger Destination Marker + ARRIVAL Label */}
                    <g transform="translate(372, 82)">
                      <g data-hero-node>
                        <circle r="22" fill="#E6C477" fillOpacity="0.14" stroke="#E6C477" strokeOpacity="0.38" strokeWidth="1" />
                        <circle r="13" fill="#063B27" stroke="#E6C477" strokeWidth="2" />
                        <circle r="7.5" fill="#E6C477" />
                        <circle r="2.8" fill="#F3F0E6" />
                      </g>
                      <text
                        data-hero-label
                        x="0"
                        y="-32"
                        textAnchor="middle"
                        fill="#E6C477"
                        fontSize="11.5"
                        fontWeight="600"
                        letterSpacing="1.6"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        ARRIVAL
                      </text>
                    </g>
                  </svg>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BRAND STORY SPREAD (Alternating Visual & Narrative Composition) */}
      <div className="relative border-t border-[#285640] bg-[#032A1D] py-16 sm:py-22 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_26%_50%,rgba(11,73,51,0.52),transparent_72%)]"
        />

        <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10">
          {/* Left: Bespoke CSS/SVG Architectural Triad Illustration */}
          <div data-story-left className="order-2 lg:order-1 lg:col-span-6">
            <div
              data-arch-diagram
              className="relative overflow-hidden rounded-3xl bg-[#063B27]/55 p-6 ring-1 ring-[#E8EEE8]/10 sm:p-8"
            >
              <svg
                viewBox="0 0 520 360"
                className="h-auto w-full"
                role="img"
                aria-label="Architectural diagram showing parent-linked supervision, verified driver identity, and connected teen mobility"
              >
                {/* Delicate architectural coordinate rings */}
                <g fill="none" stroke="#285640" strokeWidth="1">
                  <circle cx="260" cy="180" r="144" strokeDasharray="4 6" />
                  <circle cx="260" cy="180" r="96" opacity="0.65" />
                  <line x1="36" y1="180" x2="484" y2="180" opacity="0.45" />
                  <line x1="260" y1="24" x2="260" y2="336" opacity="0.45" />
                </g>

                {/* Base corridor guide arcs */}
                <g fill="none" stroke="#285640" strokeWidth="2" strokeLinecap="round">
                  <path d="M 118 96 Q 220 72, 388 168" />
                  <path d="M 118 264 Q 220 288, 388 192" />
                  <path d="M 106 118 Q 88 180, 106 242" />
                </g>

                {/* Animated gold connection paths */}
                <path
                  data-arch-path
                  d="M 118 96 Q 220 72, 388 168"
                  fill="none"
                  stroke="#D9B45B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  data-arch-path
                  d="M 118 264 Q 220 288, 388 192"
                  fill="none"
                  stroke="#E6C477"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  data-arch-path
                  d="M 106 118 Q 88 180, 106 242"
                  fill="none"
                  stroke="#B7C8BA"
                  strokeOpacity="0.65"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Node 1: Parent-linked supervision */}
                <g transform="translate(108, 96)">
                  <circle r="32" fill="#032A1D" stroke="#D9B45B" strokeOpacity="0.45" strokeWidth="1.5" />
                  <circle r="18" fill="#0B4933" stroke="#E6C477" strokeWidth="1.5" />
                  {/* Nested link rings icon */}
                  <circle cx="-4" cy="0" r="5" fill="none" stroke="#E6C477" strokeWidth="1.75" />
                  <circle cx="4" cy="0" r="5" fill="none" stroke="#E6C477" strokeWidth="1.75" />
                </g>

                {/* Node 2: Verified driver identity */}
                <g transform="translate(108, 264)">
                  <circle r="32" fill="#032A1D" stroke="#D9B45B" strokeOpacity="0.45" strokeWidth="1.5" />
                  <circle r="18" fill="#0B4933" stroke="#E6C477" strokeWidth="1.5" />
                  {/* Shield checkmark vector */}
                  <path
                    d="M 0 -7 L 6 -4.5 V 0.5 C 6 4.5 3.4 7.3 0 8.5 C -3.4 7.3 -6 4.5 -6 0.5 V -4.5 Z"
                    fill="none"
                    stroke="#E6C477"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M -2.5 0.5 L -0.5 2.5 L 3 -1.5"
                    fill="none"
                    stroke="#E6C477"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Node 3: Connected teen mobility (Primary focal hub) */}
                <g transform="translate(404, 180)">
                  <circle
                    r="48"
                    fill="#E6C477"
                    fillOpacity="0.1"
                    className="animate-living-breath"
                  />
                  <circle r="34" fill="#032A1D" stroke="#E6C477" strokeWidth="1.75" />
                  <circle r="22" fill="#E6C477" />
                  {/* Twin-chevron mobility emblem */}
                  <path
                    d="M -5 -6 L 2 0 L -5 6 M 1 -6 L 8 0 L 1 6"
                    fill="none"
                    stroke="#032A1D"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Subtle Architectural Labels inside SVG */}
                <text
                  x="156"
                  y="56"
                  fill="#E8EEE8"
                  fontSize="12"
                  fontWeight="500"
                  fontFamily="Outfit, sans-serif"
                >
                  Parent-linked supervision
                </text>
                <text
                  x="156"
                  y="316"
                  fill="#E8EEE8"
                  fontSize="12"
                  fontWeight="500"
                  fontFamily="Outfit, sans-serif"
                >
                  Verified driver identity
                </text>
                <text
                  x="404"
                  y="252"
                  textAnchor="middle"
                  fill="#E6C477"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Outfit, sans-serif"
                >
                  Connected teen mobility
                </text>
              </svg>
            </div>
          </div>

          {/* Right: Engineering Rationale Narrative */}
          <div data-story-right className="order-1 lg:order-2 lg:col-span-6">
            <p className="mb-3 text-xs font-medium tracking-wide text-[#B7C8BA] sm:text-sm">
              Why purpose-built matters
            </p>
            <h2 className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[2.625rem]">
              Engineered from the{' '}
              <span className="font-editorial font-normal italic text-[#E6C477]">
                ground up.
              </span>
            </h2>

            <p className="mt-6 max-w-[48ch] text-base leading-[1.78] font-light text-[#D4E1D8]">
              Rather than adapting generic adult ride-hailing apps, Forgeit
              engineered Teen Cabs from the ground up — connecting parent-linked
              supervision, vetted drivers, and calm Gen Z product clarity into
              one cohesive platform.
            </p>

            {/* Three quiet architectural pillars echoing the diagram */}
            <dl className="mt-9 grid grid-cols-1 gap-4 border-t border-[#285640] pt-7 sm:grid-cols-3 sm:gap-6">
              <div data-story-pillar>
                <dt className="font-mono text-[11px] font-medium text-[#E6C477] tabular-nums">
                  01
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-[#E8EEE8]">
                  Parent-linked supervision
                </dd>
              </div>
              <div data-story-pillar>
                <dt className="font-mono text-[11px] font-medium text-[#E6C477] tabular-nums">
                  02
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-[#E8EEE8]">
                  Verified driver identity
                </dd>
              </div>
              <div data-story-pillar>
                <dt className="font-mono text-[11px] font-medium text-[#E6C477] tabular-nums">
                  03
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-[#E8EEE8]">
                  Connected teen mobility
                </dd>
              </div>
            </dl>
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

            {/* Asymmetric Statement 02 — Our Vision (diagonally stepped open tonal spread) */}
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
