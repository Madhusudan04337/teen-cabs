import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import { Bike, CarFront } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const HERO_PICKUP: Point = { x: 118, y: 224 };
const HERO_C1: Point = { x: 196, y: 124 };
const HERO_C2: Point = { x: 322, y: 108 };
const HERO_DROPOFF: Point = { x: 438, y: 122 };

const HERO_BIKE_P0: Point = { x: 118, y: 224 };
const HERO_BIKE_C1: Point = { x: 226, y: 266 };
const HERO_BIKE_C2: Point = { x: 344, y: 212 };
const HERO_BIKE_P3: Point = { x: 438, y: 122 };

const DASHBOARD_P0: Point = { x: 150, y: 208 };
const DASHBOARD_C1: Point = { x: 225, y: 140 };
const DASHBOARD_C2: Point = { x: 325, y: 100 };
const DASHBOARD_P3: Point = { x: 415, y: 120 };

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
  const bikeMarkerRef = useRef<HTMLDivElement>(null);
  const dashboardCarRef = useRef<HTMLDivElement>(null);
  const primaryRouteRef = useRef<SVGPathElement>(null);
  const bikeRouteRef = useRef<SVGPathElement>(null);

  // Mutable animation refs prevent 60fps React re-renders and preserve smooth progress
  const mapBoundsRef = useRef({ width: 560, height: isHero ? 385 : 350 });
  const carTRef = useRef(stageTargetT);
  const targetCarTRef = useRef(stageTargetT);
  const bikeTRef = useRef(0.42);
  const elapsedRef = useRef(0);

  // Synchronize target checkpoint without restarting running rAF loops
  useEffect(() => {
    targetCarTRef.current = stageTargetT;
  }, [stageTargetT]);

  // Smooth GSAP solid route-line draw entrance on initial mount
  useEffect(() => {
    if (!isHero || prefersReducedMotion) return;
    const paths = [primaryRouteRef.current, bikeRouteRef.current].filter(
      Boolean
    ) as SVGPathElement[];

    const tweens: gsap.core.Tween[] = [];
    paths.forEach((path, idx) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tweens.push(
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.35,
          delay: 0.25 + idx * 0.2,
          ease: 'power3.out',
        })
      );
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [isHero, prefersReducedMotion]);

  // Track responsive map pixel box and position Hero markers purely via GPU transforms
  useEffect(() => {
    if (!isHero) return;
    const box = mapContainerRef.current;
    const carEl = carMarkerRef.current;
    const bikeEl = bikeMarkerRef.current;
    if (!box || !carEl || !bikeEl) return;

    const setCarX = gsap.quickSetter(carEl, 'x', 'px');
    const setCarY = gsap.quickSetter(carEl, 'y', 'px');
    const setBikeX = gsap.quickSetter(bikeEl, 'x', 'px');
    const setBikeY = gsap.quickSetter(bikeEl, 'y', 'px');

    const applyMarkerTransforms = (carProgress: number, bikeProgress: number) => {
      const { width, height } = mapBoundsRef.current;
      const carPt = sampleCubicBezier(
        carProgress,
        HERO_PICKUP,
        HERO_C1,
        HERO_C2,
        HERO_DROPOFF
      );
      const bikePt = sampleCubicBezier(
        bikeProgress,
        HERO_BIKE_P0,
        HERO_BIKE_C1,
        HERO_BIKE_C2,
        HERO_BIKE_P3
      );

      setCarX((carPt.x / 560) * width);
      setCarY((carPt.y / 360) * height);
      setBikeX((bikePt.x / 560) * width);
      setBikeY((bikePt.y / 360) * height);
    };

    const syncBounds = () => {
      const rect = box.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mapBoundsRef.current = { width: rect.width, height: rect.height };
        applyMarkerTransforms(carTRef.current, bikeTRef.current);
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
        applyMarkerTransforms(carTRef.current, bikeTRef.current);
      } else {
        tweenObj = { t: carTRef.current };
        tween = gsap.to(tweenObj, {
          t: stageTargetT,
          duration: 0.7,
          ease: 'power3.out',
          onUpdate: () => {
            if (!tweenObj) return;
            carTRef.current = tweenObj.t;
            applyMarkerTransforms(carTRef.current, bikeTRef.current);
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

      // Advance Bike smoothly along the secondary express corridor
      bikeTRef.current += dt * 0.075;
      if (bikeTRef.current > 0.96) {
        bikeTRef.current = 0.08;
      }

      applyMarkerTransforms(carTRef.current, bikeTRef.current);
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
      const pt = sampleCubicBezier(
        progress,
        DASHBOARD_P0,
        DASHBOARD_C1,
        DASHBOARD_C2,
        DASHBOARD_P3
      );
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
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#D8D9C9] bg-[#E8EEE8]"
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
            d={`M ${DASHBOARD_P0.x} ${DASHBOARD_P0.y} C ${DASHBOARD_C1.x} ${DASHBOARD_C1.y}, ${DASHBOARD_C2.x} ${DASHBOARD_C2.y}, ${DASHBOARD_P3.x} ${DASHBOARD_P3.y}`}
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
          <div className="flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#063B27] text-[#E6C477] shadow-xl shadow-black/30 ring-2 ring-[#FFFFFF]">
            <CarFront className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#D8D9C9] bg-[#F3F0E6] p-4 text-[#063B27] shadow-2xl shadow-black/45 sm:p-6">
      {/* Header matching Parent Dashboard card discipline */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <p className="text-xs font-bold tracking-wide text-[#063B27] sm:text-sm">
            {perspectiveMode === 'parent' ? 'Parent route monitor' : 'Teen ride corridor'}
          </p>
          <span className="text-xs text-[#547064]" aria-hidden="true">
            ·
          </span>
          <span className="text-xs font-medium text-[#547064]">Sample preview</span>
        </div>
        <span className="font-mono text-[11px] font-semibold tracking-wide text-[#063B27]">
          {activeStage === 'pickup'
            ? 'Gate pickup'
            : activeStage === 'enroute'
              ? 'Safe corridor'
              : 'Verified drop-off'}
        </span>
      </div>

      {/* Shared Pale Sage (#E8EEE8) Street Map Surface with Soft Gold & Deep Green Route Geometry */}
      <div
        ref={mapContainerRef}
        className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-[#D8D9C9] bg-[#E8EEE8]"
      >
        <svg
          viewBox="0 0 560 360"
          className="h-full w-full"
          role="img"
          aria-label="Interactive Teen Cabs route map demonstration showing a car and bike moving smoothly between pickup location Oakridge High and destination Maple Street"
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
            fontSize="11"
            fontWeight="700"
            fontFamily="Outfit, sans-serif"
            letterSpacing="0.06em"
            opacity="0.92"
          >
            <text x="164" y="88" transform="rotate(-8 164 88)">
              PARKVIEW CORRIDOR
            </text>
            <text x="206" y="302" transform="rotate(-5 206 302)">
              SCHOOL EXPRESSWAY
            </text>
          </g>

          {/* Secondary Bike Route Track (GSAP draws base track -> animated gold dash) */}
          <path
            ref={bikeRouteRef}
            d={`M ${HERO_BIKE_P0.x} ${HERO_BIKE_P0.y} C ${HERO_BIKE_C1.x} ${HERO_BIKE_C1.y}, ${HERO_BIKE_C2.x} ${HERO_BIKE_C2.y}, ${HERO_BIKE_P3.x} ${HERO_BIKE_P3.y}`}
            fill="none"
            stroke="#547064"
            strokeOpacity="0.34"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d={`M ${HERO_BIKE_P0.x} ${HERO_BIKE_P0.y} C ${HERO_BIKE_C1.x} ${HERO_BIKE_C1.y}, ${HERO_BIKE_C2.x} ${HERO_BIKE_C2.y}, ${HERO_BIKE_P3.x} ${HERO_BIKE_P3.y}`}
            fill="none"
            stroke="#D9B45B"
            strokeWidth="3.2"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="animate-route-dash"
          />

          {/* Primary Cab Route Track (GSAP draws base track -> animated deep forest dash) */}
          <path
            ref={primaryRouteRef}
            d={`M ${HERO_PICKUP.x} ${HERO_PICKUP.y} C ${HERO_C1.x} ${HERO_C1.y}, ${HERO_C2.x} ${HERO_C2.y}, ${HERO_DROPOFF.x} ${HERO_DROPOFF.y}`}
            fill="none"
            stroke="#063B27"
            strokeOpacity="0.18"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d={`M ${HERO_PICKUP.x} ${HERO_PICKUP.y} C ${HERO_C1.x} ${HERO_C1.y}, ${HERO_C2.x} ${HERO_C2.y}, ${HERO_DROPOFF.x} ${HERO_DROPOFF.y}`}
            fill="none"
            stroke="#063B27"
            strokeWidth="4.5"
            strokeDasharray="9 7"
            strokeLinecap="round"
            className="animate-route-dash"
          />

          {/* Pickup Location Marker (A) with Soft Pulse */}
          <g transform={`translate(${HERO_PICKUP.x}, ${HERO_PICKUP.y})`}>
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
          <g transform={`translate(${HERO_DROPOFF.x}, ${HERO_DROPOFF.y})`}>
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

        {/* Floating Pickup Label — kept well clear of bottom/left edges on 360px+ viewports */}
        <div
          style={{
            left: `${(HERO_PICKUP.x / 560) * 100}%`,
            top: `${(HERO_PICKUP.y / 360) * 100}%`,
          }}
          className="pointer-events-none absolute -translate-x-1/4 translate-y-4 rounded-lg border border-[#D8D9C9] bg-[#F3F0E6]/95 px-2 py-0.5 shadow-sm backdrop-blur-xs sm:translate-y-5 sm:px-2.5 sm:py-1"
        >
          <p className="text-[9px] font-semibold text-[#3B5B4B] sm:text-[10px]">Pickup</p>
          <p className="whitespace-nowrap text-[10px] font-bold text-[#063B27] sm:text-[11px]">
            Oakridge High
          </p>
        </div>

        {/* Floating Destination Label — kept safely inside top/right bounds & clear of arrival cab */}
        <div
          style={{
            left: `${(HERO_DROPOFF.x / 560) * 100}%`,
            top: `${(HERO_DROPOFF.y / 360) * 100}%`,
          }}
          className="pointer-events-none absolute -translate-x-[62%] -translate-y-12 rounded-lg border border-[#D8D9C9] bg-[#F3F0E6]/95 px-2 py-0.5 shadow-sm backdrop-blur-xs sm:-translate-y-14 sm:px-2.5 sm:py-1"
        >
          <p className="text-[9px] font-semibold text-[#3B5B4B] sm:text-[10px]">Destination</p>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#063B27] text-[#E6C477] shadow-xl shadow-black/30 ring-2 ring-[#FFFFFF] sm:h-11 sm:w-11">
              <CarFront className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Animated Bike Vehicle Marker (Transform-only GPU motion) */}
        <div
          ref={bikeMarkerRef}
          className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform"
        >
          <div className="relative flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6C477] text-[#032A1D] shadow-lg shadow-black/25 ring-2 ring-[#FFFFFF]">
              <Bike className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="mt-1 hidden rounded-md border border-[#D8D9C9] bg-[#F3F0E6] px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-[#063B27] shadow-sm sm:block">
              Teen Bike · Shuttle
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Map Legend Row inside the Warm Ivory Frame with high-contrast vehicle chips */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#D8D9C9] pt-3 text-xs text-[#3B5B4B]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 font-medium text-[#063B27]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#063B27] text-[#E6C477]">
              <CarFront className="h-3 w-3" aria-hidden="true" />
            </span>
            Verified Cab
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-[#063B27]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#E6C477] text-[#032A1D] ring-1 ring-[#063B27]/20">
              <Bike className="h-3 w-3" aria-hidden="true" />
            </span>
            Campus Bike
          </span>
        </div>
        <span className="font-mono text-[11px] font-medium text-[#3B5B4B]">
          2.4 km corridor · Route A → B
        </span>
      </div>
    </div>
  );
}

export const RouteMapCanvas = memo(RouteMapCanvasInner);
