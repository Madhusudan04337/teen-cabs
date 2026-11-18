import { memo, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { CarFront } from 'lucide-react';
import { gsap, useGSAP } from '../motion/setup';

interface Point {
  x: number;
  y: number;
}

const HERO_PICKUP: Point = { x: 118, y: 224 };
const HERO_DROPOFF: Point = { x: 438, y: 122 };
const HERO_ROUTE: Point[] = [
  HERO_PICKUP,
  { x: 118, y: 196 },
  { x: 215, y: 196 },
  HERO_DROPOFF,
];

const DASHBOARD_P0: Point = { x: 150, y: 208 };
const DASHBOARD_P3: Point = { x: 415, y: 120 };
const DASHBOARD_ROUTE: Point[] = [
  DASHBOARD_P0,
  { x: 150, y: 196 },
  { x: 270, y: 205 },
  DASHBOARD_P3,
];

function sampleCubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const clamped = Math.max(0, Math.min(1, t));
  const u = 1 - clamped;
  const tt = clamped * clamped;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * clamped;

  return {
    x: uuu * p0.x + 3 * uu * clamped * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * clamped * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

function samplePolyline(t: number, points: Point[]): Point {
  const clamped = Math.max(0, Math.min(1, t));
  if (points.length < 2) return points[0];

  const segmentLengths = points.slice(1).map((point, index) => {
    const start = points[index];
    return Math.hypot(point.x - start.x, point.y - start.y);
  });
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);
  let remaining = clamped * totalLength;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const length = segmentLengths[index];
    if (remaining <= length) {
      const ratio = length === 0 ? 0 : remaining / length;
      const start = points[index];
      const end = points[index + 1];
      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      };
    }
    remaining -= length;
  }

  return points[points.length - 1];
}

export interface HeroMapProps {
  variant: 'hero';
  activeStage: 'pickup' | 'enroute' | 'dropoff';
  perspectiveMode: 'parent' | 'teen';
  isAutoPlaying: boolean;
}

export interface DashboardMapProps {
  variant: 'dashboard';
  approvalState: 'pending' | 'approved' | 'declined';
}

export type RouteMapCanvasProps = HeroMapProps | DashboardMapProps;

function RouteMapCanvasInner(props: RouteMapCanvasProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isHero = props.variant === 'hero';
  const isHeroAutoPlaying = props.variant === 'hero' ? props.isAutoPlaying : false;
  const activeStage = props.variant === 'hero' ? props.activeStage : 'enroute';
  const perspectiveMode = props.variant === 'hero' ? props.perspectiveMode : 'parent';
  const approvalState = props.variant === 'dashboard' ? props.approvalState : 'pending';

  const stageTargetT = isHero
    ? activeStage === 'pickup'
      ? 0.16
      : activeStage === 'enroute'
        ? 0.54
        : 0.78
    : approvalState === 'pending'
      ? 0.34
      : approvalState === 'approved'
        ? 0.72
        : 0.14;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const carMarkerRef = useRef<HTMLDivElement>(null);
  const dashboardCarRef = useRef<HTMLDivElement>(null);
  const primaryRouteRef = useRef<SVGPathElement>(null);
  const dashboardRouteRef = useRef<SVGPathElement>(null);

  // Mutable animation refs prevent 60fps React re-renders and preserve smooth progress
  const mapBoundsRef = useRef({ width: 560, height: isHero ? 385 : 350 });
  const carTRef = useRef(stageTargetT);
  const targetCarTRef = useRef(stageTargetT);
  const elapsedRef = useRef(0);

  // Synchronize target checkpoint without restarting running rAF loops
  useEffect(() => {
    targetCarTRef.current = stageTargetT;
  }, [stageTargetT]);

  // Smooth GSAP DrawSVGPlugin route-line draw and staggered pin entrance wrapped in useGSAP
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (isHero) {
          if (primaryRouteRef.current) {
            gsap.fromTo(
              primaryRouteRef.current,
              { drawSVG: '0%' },
              {
                drawSVG: '100%',
                duration: 1.25,
                delay: 0.25,
                ease: 'power3.out',
              }
            );
          }

          gsap.from('[data-hero-pin]', {
            scale: 0.65,
            opacity: 0,
            duration: 0.55,
            delay: 0.35,
            stagger: 0.14,
            ease: 'back.out(1.6)',
            transformOrigin: 'center center',
            clearProps: 'transform,opacity',
          });
        } else if (dashboardRouteRef.current) {
          gsap.fromTo(
            dashboardRouteRef.current,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: 1.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: mapContainerRef.current,
                start: 'top 86%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: mapContainerRef, dependencies: [isHero, prefersReducedMotion] }
  );

  // Track responsive map pixel box and position Hero markers purely via GPU transforms
  useEffect(() => {
    if (!isHero) return;
    const box = mapContainerRef.current;
    const carEl = carMarkerRef.current;
    if (!box || !carEl) return;

    const setCarX = gsap.quickSetter(carEl, 'x', 'px');
    const setCarY = gsap.quickSetter(carEl, 'y', 'px');

    const applyMarkerTransforms = (carProgress: number) => {
      const { width, height } = mapBoundsRef.current;
      const carPt = samplePolyline(carProgress, HERO_ROUTE);

      setCarX((carPt.x / 560) * width);
      setCarY((carPt.y / 360) * height);
    };

    const syncBounds = () => {
      const rect = box.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mapBoundsRef.current = { width: rect.width, height: rect.height };
        applyMarkerTransforms(carTRef.current);
      }
    };

    syncBounds();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(syncBounds)
        : null;
    resizeObserver?.observe(box);

    if (prefersReducedMotion || !isHeroAutoPlaying) {
      let tweenObj: { t: number } | null = null;
      let tween: gsap.core.Tween | null = null;

      if (prefersReducedMotion) {
        carTRef.current = stageTargetT;
        applyMarkerTransforms(carTRef.current);
      } else {
        tweenObj = { t: carTRef.current };
        tween = gsap.to(tweenObj, {
          t: stageTargetT,
          duration: 0.7,
          ease: 'power3.out',
          onUpdate: () => {
            if (!tweenObj) return;
            carTRef.current = tweenObj.t;
            applyMarkerTransforms(carTRef.current);
          },
        });
      }

      return () => {
        tween?.kill();
        resizeObserver?.disconnect();
      };
    }

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsedRef.current += dt;

      // Ease base checkpoint smoothly while gliding gently along the active corridor without overlapping Pin A/B
      const target = targetCarTRef.current;
      const wanderOffset = Math.sin(elapsedRef.current * 0.95) * 0.035;
      const desiredCarT = Math.max(0.12, Math.min(0.81, target + wanderOffset));
      carTRef.current += (desiredCarT - carTRef.current) * Math.min(dt * 3.0, 0.16);

      applyMarkerTransforms(carTRef.current);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [isHero, isHeroAutoPlaying, prefersReducedMotion, stageTargetT]);

  // Dashboard Variant: GPU-composited transform-only car animation via GSAP
  useEffect(() => {
    if (isHero) return;
    const box = mapContainerRef.current;
    const carEl = dashboardCarRef.current;
    if (!box || !carEl) return;

    const getDashboardPixelPos = (progress: number) => {
      const rect = box.getBoundingClientRect();
      const pt = samplePolyline(progress, DASHBOARD_ROUTE);
      return {
        x: (pt.x / 560) * (rect.width || 560),
        y: (pt.y / 350) * (rect.height || 350),
      };
    };

    const syncDashboardPos = () => {
      const { x, y } = getDashboardPixelPos(carTRef.current);
      gsap.set(carEl, { x, y });
    };

    let tween: gsap.core.Tween | null = null;
    if (prefersReducedMotion) {
      const { x, y } = getDashboardPixelPos(stageTargetT);
      gsap.set(carEl, { x, y });
      carTRef.current = stageTargetT;
    } else {
      const tweenObj = { t: carTRef.current };
      tween = gsap.to(tweenObj, {
        t: stageTargetT,
        duration: 0.65,
        ease: 'back.out(1.2)',
        onUpdate: () => {
          carTRef.current = tweenObj.t;
          const pos = getDashboardPixelPos(carTRef.current);
          gsap.set(carEl, { x: pos.x, y: pos.y });
        },
      });
    }

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(syncDashboardPos)
        : null;
    resizeObserver?.observe(box);

    return () => {
      tween?.kill();
      resizeObserver?.disconnect();
    };
  }, [isHero, prefersReducedMotion, stageTargetT]);

  if (!isHero) {
    return (
      <div
        ref={mapContainerRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#D8D9C9] bg-[#E8EEE8] sm:rounded-2xl"
      >
        <svg
          viewBox="0 0 560 350"
          className="h-full w-full"
          role="img"
          aria-label="Parent dashboard live street map showing route from pickup point A to destination point B with a mini cab"
        >
          <g stroke="#D8D9C9" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M-15 110 L215 190 L580 75" />
            <path d="M-15 265 L270 205 L580 280" />
            <path d="M95 -20 L135 370" />
            <path d="M275 -20 L250 370" />
            <path d="M445 -20 L405 370" />
          </g>

          <path
            ref={dashboardRouteRef}
            d="M 150 208 L 150 196 L 270 205 L 415 120"
            fill="none"
            stroke="#063B27"
            strokeOpacity="0.16"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M 150 208 L 150 196 L 270 205 L 415 120"
            fill="none"
            stroke={approvalState === 'approved' ? '#063B27' : '#D9B45B'}
            strokeWidth="4.5"
            strokeDasharray="8 7"
            strokeLinecap="round"
            className="animate-route-dash"
          />

          {/* Pin A */}
          <g transform={`translate(${DASHBOARD_P0.x}, ${DASHBOARD_P0.y})`}>
            <circle r="24" fill="#063B27" fillOpacity="0.12" />
            <circle r="14" fill="#063B27" stroke="#FFFFFF" strokeWidth="3" />
            <text
              y="4"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
            >
              A
            </text>
          </g>

          {/* Pin B */}
          <g transform={`translate(${DASHBOARD_P3.x}, ${DASHBOARD_P3.y})`}>
            <circle r="24" fill="#D9B45B" fillOpacity="0.22" />
            <circle r="14" fill="#E6C477" stroke="#FFFFFF" strokeWidth="3" />
            <text
              y="4"
              textAnchor="middle"
              fill="#032A1D"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
            >
              B
            </text>
          </g>
        </svg>

        <div
          ref={dashboardCarRef}
          className="pointer-events-none absolute top-0 left-0 will-change-transform"
        >
          <div className="flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-[#063B27] text-[#E6C477] shadow-xl shadow-black/30 ring-2 ring-[#FFFFFF] sm:h-11 sm:w-11 sm:rounded-xl">
            <CarFront className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[#063B27]">
      {/* Sub-header status bar */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-0.5 sm:mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold tracking-wide text-[#063B27] sm:text-sm">
            {perspectiveMode === 'parent' ? 'Parent route monitor' : 'Teen ride corridor'}
          </p>
          <span className="hidden text-xs text-[#547064] sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden text-xs font-medium text-[#547064] sm:inline">
            Sample preview
          </span>
        </div>
        <span className="rounded-full bg-[#E8EEE8] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-[#063B27] sm:bg-transparent sm:px-0 sm:py-0 sm:text-[11px]">
          {activeStage === 'pickup'
            ? 'Gate pickup'
            : activeStage === 'enroute'
              ? 'Safe corridor'
              : 'Verified drop-off'}
        </span>
      </div>

      {/* Shared Pale Sage (#E8EEE8) Street Map Surface matching 560x360 viewBox aspect */}
      <div
        ref={mapContainerRef}
        className="relative aspect-[560/360] w-full overflow-hidden rounded-xl border border-[#D8D9C9] bg-[#E8EEE8] sm:rounded-2xl"
      >
        <svg
          viewBox="0 0 560 360"
          className="h-full w-full"
          role="img"
          aria-label="Interactive Teen Cabs route map demonstration showing a car moving along the route between pickup location Oakridge High and destination Maple Street"
        >
          {/* Quiet secondary neighborhood blocks & roads matching Parent Dashboard */}
          <g stroke="#D8D9C9" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.72">
            <path d="M-20 72 L580 56" />
            <path d="M-20 185 L580 154" />
            <path d="M-20 310 L580 284" />
            <path d="M72 -20 L108 380" />
            <path d="M242 -20 L226 380" />
            <path d="M412 -20 L386 380" />
          </g>

          {/* Main arterial avenues matching Parent Dashboard weight */}
          <g stroke="#D8D9C9" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M-15 118 L215 196 L580 82" />
            <path d="M-15 272 L275 212 L580 278" />
            <path d="M108 -20 L142 380" />
            <path d="M312 -20 L282 380" />
            <path d="M465 -20 L422 380" />
          </g>

          {/* Legible map street labels */}
          <g
            fill="#3B5B4B"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="Outfit, sans-serif"
            letterSpacing="0.06em"
            opacity="0.88"
          >
            <text x="164" y="88" transform="rotate(-8 164 88)">
              PARKVIEW CORRIDOR
            </text>
            <text x="206" y="302" transform="rotate(-5 206 302)">
              SCHOOL EXPRESSWAY
            </text>
          </g>

          {/* Primary Cab Route Track (GSAP draws base track -> animated deep forest dash) */}
          <path
            ref={primaryRouteRef}
            d="M 118 224 L 118 196 L 215 196 L 438 122"
            fill="none"
            stroke="#063B27"
            strokeOpacity="0.18"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 118 224 L 118 196 L 215 196 L 438 122"
            fill="none"
            stroke="#063B27"
            strokeWidth="4.5"
            strokeDasharray="9 7"
            strokeLinecap="round"
            className="animate-route-dash"
          />

          {/* Pickup Location Marker (A) with Soft Pulse */}
          <g data-hero-pin transform={`translate(${HERO_PICKUP.x}, ${HERO_PICKUP.y})`}>
            <circle r="24" fill="#063B27" fillOpacity="0.14" className="animate-living-breath" />
            <circle r="14" fill="#063B27" stroke="#FFFFFF" strokeWidth="3" />
            <text
              y="4"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
            >
              A
            </text>
          </g>

          {/* Destination Location Marker (B) with Soft Pulse */}
          <g data-hero-pin transform={`translate(${HERO_DROPOFF.x}, ${HERO_DROPOFF.y})`}>
            <circle r="24" fill="#D9B45B" fillOpacity="0.28" className="animate-living-breath" />
            <circle r="14" fill="#E6C477" stroke="#FFFFFF" strokeWidth="3" />
            <text
              y="4"
              textAnchor="middle"
              fill="#032A1D"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
            >
              B
            </text>
          </g>
        </svg>

        {/* Floating Pickup Label — compact and safely inside mobile viewport */}
        <div
          style={{
            left: `${(HERO_PICKUP.x / 560) * 100}%`,
            top: `${(HERO_PICKUP.y / 360) * 100}%`,
          }}
          className="pointer-events-none absolute -translate-x-[22%] translate-y-3 rounded-lg border border-[#D8D9C9] bg-[#F3F0E6]/95 px-2 py-0.5 shadow-sm backdrop-blur-xs sm:-translate-x-1/4 sm:translate-y-5 sm:px-2.5 sm:py-1"
        >
          <p className="text-[8px] font-semibold uppercase tracking-wide text-[#3B5B4B] sm:text-[10px] sm:normal-case sm:tracking-normal">
            Pickup
          </p>
          <p className="whitespace-nowrap text-[10px] font-bold text-[#063B27] sm:text-[11px]">
            Oakridge High
          </p>
        </div>

        {/* Floating Destination Label — compact and safely inside top/right bounds */}
        <div
          style={{
            left: `${(HERO_DROPOFF.x / 560) * 100}%`,
            top: `${(HERO_DROPOFF.y / 360) * 100}%`,
          }}
          className="pointer-events-none absolute -translate-x-[68%] -translate-y-11 rounded-lg border border-[#D8D9C9] bg-[#F3F0E6]/95 px-2 py-0.5 shadow-sm backdrop-blur-xs sm:-translate-x-[62%] sm:-translate-y-14 sm:px-2.5 sm:py-1"
        >
          <p className="text-[8px] font-semibold uppercase tracking-wide text-[#3B5B4B] sm:text-[10px] sm:normal-case sm:tracking-normal">
            Destination
          </p>
          <p className="whitespace-nowrap text-[10px] font-bold text-[#063B27] sm:text-[11px]">
            Maple Street
          </p>
        </div>

        {/* Animated Car Vehicle Marker (Transform-only GPU motion) */}
        <div
          ref={carMarkerRef}
          className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform"
        >
          <div className="relative flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <div className="mb-1.5 hidden rounded-md border border-[#285640]/20 bg-[#063B27] px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-[#E6C477] shadow-md sm:block">
              Cab · Arjun K.
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#063B27] text-[#E6C477] shadow-lg shadow-black/30 ring-2 ring-[#FFFFFF] sm:h-11 sm:w-11 sm:rounded-xl sm:shadow-xl">
              <CarFront className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Map Legend Row inside the Warm Ivory Frame with high-contrast vehicle chips */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#D8D9C9] pt-2.5 text-[11px] text-[#3B5B4B] sm:mt-3.5 sm:pt-3 sm:text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#063B27] sm:gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#063B27] text-[#E6C477] sm:h-5 sm:w-5 sm:rounded-md">
              <CarFront className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true" />
            </span>
            Verified Cab
          </span>
        </div>
        <span className="font-mono text-[10px] font-medium text-[#3B5B4B] sm:text-[11px]">
          2.4 km corridor · Route A → B
        </span>
      </div>
    </div>
  );
}

export const RouteMapCanvas = memo(RouteMapCanvasInner);
