import { useReducedMotion } from 'motion/react';

const TICKER_ITEMS = [
  'SAFE RIDES',
  'VERIFIED DRIVERS',
  'PARENTAL PEACE OF MIND',
  'LIVE JOURNEY VISIBILITY',
  'TEEN-FIRST MOBILITY',
  'TRUSTED TRANSPORTATION',
  'PARENT-LINKED ACCOUNTS',
  'SUB-5S GPS CORRIDORS',
  '24/7 SAFETY DESK',
  'BUILT FOR GEN Z',
  'ONE-TAP APPROVALS',
  'A FORGEIT PRODUCT',
] as const;

function TickerTrack({
  hidden = false,
  reducedMotion = false,
}: {
  hidden?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={`flex shrink-0 items-center ${
        reducedMotion
          ? 'w-full flex-wrap justify-center gap-x-6 gap-y-2 px-6'
          : 'gap-8 pr-8 sm:gap-12 sm:pr-12'
      }`}
    >
      {TICKER_ITEMS.map((phrase, idx) => {
        const isGold = idx % 2 === 0;
        return (
          <div
            key={phrase}
            className={`flex shrink-0 items-center ${
              reducedMotion ? 'gap-6' : 'gap-8 sm:gap-12'
            }`}
          >
            <span
              className={`whitespace-nowrap text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm ${
                isGold ? 'text-[#E6C477]' : 'text-[#F3F0E6]'
              }`}
            >
              {phrase}
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#D9B45B]/75"
            />
          </div>
        );
      })}
    </div>
  );
}

export function VelocityRibbon() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Teen Cabs brand principles"
      className="group relative z-10 overflow-hidden border-y border-[#285640] bg-[#063B27] py-4 sm:py-5"
    >
      {/* Left & right soft gradient masks */}
      {!prefersReducedMotion && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#063B27] to-transparent sm:w-28"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#063B27] to-transparent sm:w-28"
          />
        </>
      )}

      <div className="space-y-3">
        {/* Single Seamless Horizontal Ticker */}
        {prefersReducedMotion ? (
          <div className="flex w-full items-center justify-center">
            <TickerTrack reducedMotion />
          </div>
        ) : (
          <div
            className="flex w-max items-center animate-marquee-glide will-change-transform"
            style={{ animationDuration: '58s' }}
          >
            <TickerTrack />
            <TickerTrack hidden />
          </div>
        )}

        {/* Subtle Architectural Caption Bar */}
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 border-t border-[#285640]/70 px-6 pt-2.5 sm:px-8 lg:px-10">
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-[#B7C8BA] uppercase">
            Purpose-built teen commute infrastructure
          </span>
          <span className="hidden font-editorial text-xs italic text-[#E6C477] sm:inline">
            Parent supervision meets effortless Gen Z independence
          </span>
        </div>
      </div>
    </section>
  );
}

