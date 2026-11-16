const RIBBON_ITEMS = [
  'SAFE RIDES',
  'VERIFIED DRIVERS',
  'PARENTAL PEACE OF MIND',
  'LIVE JOURNEY VISIBILITY',
  'TEEN-FIRST MOBILITY',
  'TRUSTED TRANSPORTATION',
] as const;

function RibbonTrack({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {RIBBON_ITEMS.map((phrase, idx) => {
        const isGold = idx % 2 === 0;
        return (
          <div key={phrase} className="flex shrink-0 items-center gap-10 sm:gap-14">
            <span
              className={`whitespace-nowrap text-xs font-semibold tracking-[0.22em] uppercase sm:text-sm ${
                isGold ? 'text-[#E6C477]' : 'text-[#F3F0E6]'
              }`}
            >
              {phrase}
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#D9B45B]"
            />
          </div>
        );
      })}
    </div>
  );
}

export function VelocityRibbon() {
  return (
    <div
      aria-label="Teen Cabs brand principles"
      className="group relative z-10 overflow-hidden border-y border-[#285640] bg-[#063B27] py-4 sm:py-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#063B27] to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#063B27] to-transparent sm:w-28"
      />

      <div className="animate-marquee-glide flex w-max items-center will-change-transform">
        <RibbonTrack />
        <RibbonTrack hidden />
      </div>
    </div>
  );
}
