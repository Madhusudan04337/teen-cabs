import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { gsap, Observer, useGSAP } from '../motion/setup';

const FOREGROUND_PHRASE =
  'PURPOSE-BUILT TEEN COMMUTE INFRASTRUCTURE  ✦  PARENT SUPERVISION MEETS EFFORTLESS GEN Z INDEPENDENCE  ✦  ';

const BACKGROUND_PHRASE =
  'SAFE RIDES  ★  VERIFIED DRIVERS  ★  ONE-TAP APPROVALS  ★  LIVE JOURNEY VISIBILITY  ★  PARENTAL PEACE OF MIND  ★  ';

const FOREGROUND_REPEATED = `${FOREGROUND_PHRASE}${FOREGROUND_PHRASE}${FOREGROUND_PHRASE}${FOREGROUND_PHRASE}`;
const BACKGROUND_REPEATED = `${BACKGROUND_PHRASE}${BACKGROUND_PHRASE}${BACKGROUND_PHRASE}${BACKGROUND_PHRASE}`;

function buildSineRibbonGeometry(
  startX: number,
  endX: number,
  yMid: number,
  amplitude: number,
  width: number,
  halfWidth: number,
  directionSign: 1 | -1,
  step = 6
) {
  // Low-frequency sine curve centered at x = 0.5 * width so the two opposing ribbons
  // intersect and cross cleanly right in the center with a tight, shallow X-crossing
  const period = width * 1.75;
  const twoPiOverP = (2 * Math.PI) / period;

  const sampleY = (x: number) =>
    yMid + directionSign * amplitude * Math.sin(twoPiOverP * (x - width * 0.5));

  const sampleDyDx = (x: number) =>
    directionSign *
    amplitude *
    twoPiOverP *
    Math.cos(twoPiOverP * (x - width * 0.5));

  const centerPts: string[] = [];
  const topPts: Array<[number, number]> = [];
  const botPts: Array<[number, number]> = [];

  for (let x = startX; x <= endX; x += step) {
    const y = sampleY(x);
    const dydx = sampleDyDx(x);
    const len = Math.hypot(1, dydx) || 1;
    const nx = dydx / len;
    const ny = -1 / len;

    centerPts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    topPts.push([x + nx * halfWidth, y + ny * halfWidth]);
    botPts.push([x - nx * halfWidth, y - ny * halfWidth]);
  }

  const fmt = (pt: [number, number]) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  const centerlinePath = `M ${centerPts.join(' L ')}`;
  const topEdgePath = `M ${topPts.map(fmt).join(' L ')}`;
  const bottomEdgePath = `M ${botPts.map(fmt).join(' L ')}`;
  const ribbonFillPath = `M ${topPts.map(fmt).join(' L ')} L ${[...botPts]
    .reverse()
    .map(fmt)
    .join(' L ')} Z`;

  return {
    centerlinePath,
    topEdgePath,
    bottomEdgePath,
    ribbonFillPath,
  };
}

export function VelocityRibbon() {
  const sectionRef = useRef<HTMLElement>(null);
  const fgTextRef = useRef<SVGTextPathElement>(null);
  const bgTextRef = useRef<SVGTextPathElement>(null);
  const fgMeasureRef = useRef<SVGTSpanElement>(null);
  const bgMeasureRef = useRef<SVGTSpanElement>(null);

  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const updateWidth = () => {
      const next = Math.max(320, Math.round(el.getBoundingClientRect().width));
      setViewportWidth((prev) => (prev === next ? prev : next));
    };

    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    window.addEventListener('resize', updateWidth, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const isCompactMobile = viewportWidth < 640;
  const svgHeight = isCompactMobile ? 132 : 168;
  const yMid = svgHeight / 2;
  const amplitude = isCompactMobile ? 32 : 42;
  const halfWidth = isCompactMobile ? 22 : 29; // ~44px mobile / ~58px desktop

  const { bgGeom, fgGeom } = useMemo(() => {
    const startX = -100;
    const endX = viewportWidth + 100;
    const step = isCompactMobile ? 5 : 7;

    // Background ribbon: crests at outer edges, dips smoothly at center
    const bg = buildSineRibbonGeometry(
      startX,
      endX,
      yMid,
      amplitude,
      viewportWidth,
      halfWidth,
      1,
      step
    );

    // Foreground ribbon: rises smoothly at center, dips toward outer edges -> X-intersections at ~26% & ~74%
    const fg = buildSineRibbonGeometry(
      startX,
      endX,
      yMid,
      amplitude,
      viewportWidth,
      halfWidth,
      -1,
      step
    );

    return { bgGeom: bg, fgGeom: fg };
  }, [viewportWidth, isCompactMobile, yMid, amplitude, halfWidth]);

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const fgCycleLen = fgMeasureRef.current?.getComputedTextLength() || 1100;
        const bgCycleLen = bgMeasureRef.current?.getComputedTextLength() || 1140;

        const fgState = { offset: 0 };
        const bgState = { offset: -bgCycleLen };

        const fgLoop = gsap.to(fgState, {
          offset: -fgCycleLen,
          duration: 34,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            fgTextRef.current?.setAttribute('startOffset', fgState.offset.toFixed(2));
          },
        });

        const bgLoop = gsap.to(bgState, {
          offset: 0,
          duration: 42,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            bgTextRef.current?.setAttribute('startOffset', bgState.offset.toFixed(2));
          },
        });

        const speedState = { scale: 1 };
        let settleTween: gsap.core.Tween | null = null;

        const applyScale = (scale: number) => {
          fgLoop.timeScale(scale);
          bgLoop.timeScale(scale);
        };

        const settleScale = (duration = 0.85) => {
          settleTween?.kill();
          settleTween = gsap.to(speedState, {
            scale: 1,
            duration,
            ease: 'power2.out',
            onUpdate: () => applyScale(speedState.scale),
          });
        };

        const scrollObserver = Observer.create({
          target: window,
          type: 'wheel,scroll,touch',
          onChangeY(self) {
            const impulse = Math.min(2.4, Math.abs(self.velocityY) * 0.0014);
            const nextScale = Math.max(0.75, Math.min(3.4, 1 + impulse));
            settleTween?.kill();
            speedState.scale = nextScale;
            applyScale(nextScale);
          },
          onStop() {
            settleScale(0.85);
          },
          onStopDelay: 0.14,
        });

        const dragObserver = Observer.create({
          target: sectionRef.current,
          type: 'pointer,touch',
          lockAxis: true,
          tolerance: 8,
          onDrag(self) {
            settleTween?.kill();
            const dragBoost = Math.max(0.45, Math.min(3.6, 1 - self.deltaX * 0.08));
            speedState.scale = dragBoost;
            applyScale(dragBoost);
          },
          onDragEnd() {
            settleScale(0.85);
          },
        });

        return () => {
          scrollObserver.kill();
          dragObserver.kill();
          settleTween?.kill();
          fgLoop.kill();
          bgLoop.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, viewportWidth] }
  );

  const textStyleClass = isCompactMobile
    ? 'text-[10px] font-bold tracking-[0.12em] uppercase whitespace-pre'
    : 'text-[12.5px] font-bold tracking-[0.12em] uppercase whitespace-pre';

  return (
    <section
      ref={sectionRef}
      aria-label="Teen Cabs brand principles"
      className="relative z-10 my-1 h-[132px] w-full overflow-x-clip overflow-y-visible bg-transparent sm:my-2 sm:h-[168px]"
    >
      <span className="sr-only">
        Purpose-built teen commute infrastructure. Parent supervision meets
        effortless Gen Z independence. Safe rides, verified drivers, one-tap
        approvals, live journey visibility, parental peace of mind.
      </span>

      <svg
        aria-hidden="true"
        width={viewportWidth}
        height={svgHeight}
        viewBox={`0 0 ${viewportWidth} ${svgHeight}`}
        className="pointer-events-none block h-full w-full overflow-visible bg-transparent"
      >
        <defs>
          <path id="dual-ribbon-bg-path" d={bgGeom.centerlinePath} />
          <path id="dual-ribbon-fg-path" d={fgGeom.centerlinePath} />

          {/* Expanded filter region so drop shadows never hit a rectangular SVG clip */}
          <filter
            id="dual-ribbon-fg-shadow"
            x="-20%"
            y="-60%"
            width="140%"
            height="220%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="9"
              floodColor="#000000"
              floodOpacity="0.55"
            />
          </filter>
        </defs>

        {/* BACKGROUND RIBBON (Lower Layer — Deep Forest Green #0D2B1D) */}
        <g>
          <path d={bgGeom.ribbonFillPath} fill="#0D2B1D" />
          <path
            d={bgGeom.topEdgePath}
            fill="none"
            stroke="#C5A059"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <path
            d={bgGeom.bottomEdgePath}
            fill="none"
            stroke="#C5A059"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <text
            fill="#F3F0E6"
            fillOpacity="0.75"
            dominantBaseline="central"
            className={textStyleClass}
          >
            <textPath ref={bgTextRef} href="#dual-ribbon-bg-path" startOffset="0">
              {BACKGROUND_REPEATED}
            </textPath>
          </text>
        </g>

        {/* FOREGROUND RIBBON (Upper Layer — Rich Emerald #14422C, opacity 0.94, soft 3D shadow) */}
        <g filter="url(#dual-ribbon-fg-shadow)" opacity="0.94">
          <path d={fgGeom.ribbonFillPath} fill="#14422C" />
          <path
            d={fgGeom.topEdgePath}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <path
            d={fgGeom.bottomEdgePath}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <text
            fill="#FFFFFF"
            dominantBaseline="central"
            className={textStyleClass}
          >
            <textPath ref={fgTextRef} href="#dual-ribbon-fg-path" startOffset="0">
              {FOREGROUND_REPEATED}
            </textPath>
          </text>
        </g>

        {/* Offscreen single-cycle measurements for seamless infinite looping */}
        <text opacity="0" y="-60" className={textStyleClass}>
          <tspan ref={fgMeasureRef}>{FOREGROUND_PHRASE}</tspan>
        </text>
        <text opacity="0" y="-90" className={textStyleClass}>
          <tspan ref={bgMeasureRef}>{BACKGROUND_PHRASE}</tspan>
        </text>
      </svg>
    </section>
  );
}
