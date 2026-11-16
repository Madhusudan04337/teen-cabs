const RIBBON_ITEMS = [
  'Parent-linked accounts',
  'Verified drivers before every pickup',
  'Live GPS corridor visibility',
  'One-tap guardian ride approval',
  'Thoughtful spending boundaries',
  'Built for Gen Z independence',
  'Instant trip arrival summaries',
];

export function VelocityRibbon() {
  return (
    <div
      aria-label="Teen Cabs core safety principles"
      className="group relative z-10 overflow-hidden bg-[#012212]/90 py-4 sm:py-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#012B17] to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#012B17] to-transparent sm:w-28"
      />

      <div className="animate-marquee-glide flex w-max items-center gap-10 whitespace-nowrap will-change-transform sm:gap-12">
        {[...RIBBON_ITEMS, ...RIBBON_ITEMS].map((phrase, idx) => (
          <span
            key={`${phrase}-${idx}`}
            aria-hidden={idx >= RIBBON_ITEMS.length}
            className="font-editorial text-base italic tracking-wide text-[#CBE0D3] sm:text-lg"
          >
            <span className="mr-10 text-[#DFBA78]/65" aria-hidden="true">
              —
            </span>
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
