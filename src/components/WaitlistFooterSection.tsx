import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BrandLogoMark } from './BrandLogoMark';

interface WaitlistFooterSectionProps {
  onOpenWaitlist: () => void;
}

export function WaitlistCtaSection({ onOpenWaitlist }: WaitlistFooterSectionProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  const handleInlineSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmed)) {
      setError('Please enter a valid email address to join the beta.');
      return;
    }

    setError('');
    setJoined(true);
  };

  return (
    <div className="relative z-10">
      {/* PART 1 — WAITLIST CTA ("The Editorial Monograph Ending") */}
      <section
        id="waitlist"
        aria-labelledby="waitlist-heading"
        className="relative overflow-hidden border-t border-[#d4af37]/12 bg-transparent py-12 sm:py-16 lg:py-24"
      >
        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-medium tracking-[0.14em] text-[#D4E1D8] uppercase sm:text-sm">
              Your next ride starts here
            </p>

            <h2
              id="waitlist-heading"
              className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.025em] text-[#E8EEE8] sm:text-4xl lg:text-[3.375rem]"
            >
              Be among the first to{' '}
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                experience Teen Cabs.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-[46ch] text-base leading-[1.78] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
              We’re opening early access to a select group of families. Join the
              waitlist and help shape the future of supervised teen mobility.
            </p>

            {joined ? (
              <div
                role="status"
                className="glass-emerald mx-auto mt-10 inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-medium text-[#E8EEE8] shadow-lg shadow-black/30"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E6C477]" aria-hidden="true" />
                <span>
                  Beta invite requested for{' '}
                  <span className="font-mono text-[#E6C477]">{email.trim()}</span>.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleInlineSubmit}
                noValidate
                className="waitlist-dark-form mx-auto mt-10 max-w-lg"
              >
                <div className="flex flex-col gap-3.5 sm:flex-row">
                  <label htmlFor="footer-waitlist-email" className="sr-only">
                    Email address for early access
                  </label>
                  <input
                    id="footer-waitlist-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'footer-waitlist-error' : undefined}
                    placeholder="Enter parent or family email"
                    className="glass-emerald min-h-[50px] flex-1 rounded-full px-6 py-3.5 text-sm text-[#E8EEE8] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-[50px] shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#E6C477] px-8 py-3.5 text-sm font-semibold text-[#032A1D] shadow-lg shadow-black/25 transition-colors hover:bg-[#D9B45B]"
                  >
                    <span>Join the beta</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {error && (
                  <p
                    id="footer-waitlist-error"
                    role="alert"
                    className="glass-emerald mt-3 rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-[#E6C477] sm:text-left"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#B7C8BA]">
                  <span>No spam, no commitment. Just early access.</span>
                  <span aria-hidden="true" className="text-[#285640]">·</span>
                  <button
                    type="button"
                    onClick={onOpenWaitlist}
                    className="cursor-pointer font-semibold text-[#E6C477] underline-offset-4 hover:text-[#D9B45B] hover:underline"
                  >
                    Sign up with family role
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export function SiteFooter({ onOpenWaitlist }: WaitlistFooterSectionProps) {
  const { pathname } = useLocation();

  return (
    <footer className="relative z-10 border-t border-[#285640]/50 bg-[#061a12] py-5 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        {/* TOP ROW: RESPONSIVE BALANCED GRID (2 COLS ON MOBILE, 12 ON DESKTOP) */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Subtitle */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="group inline-flex items-center gap-2">
              <BrandLogoMark
                size={26}
                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <div>
                <p className="text-[17px] font-bold tracking-tight text-[#E8EEE8] sm:text-xl">
                  Teen Cabs
                </p>
                <p className="mt-0.5 font-mono text-[8px] font-medium tracking-[0.14em] text-[#B7C8BA] uppercase sm:text-[9px]">
                  A Forgeit Groups Company
                </p>
              </div>
            </Link>

            <p className="mt-2 max-w-[32ch] text-[11px] leading-[1.55] text-[#D4E1D8] sm:mt-3 sm:text-sm">
              Safe, supervised rides for teens.
            </p>
          </div>

          {/* Column 2: THE PRODUCT (Compact on Mobile side-by-side with Forgeit) */}
          <div className="col-span-1 lg:col-span-2">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#E6C477] uppercase sm:text-xs">
              The Product
            </p>
            <ul className="mt-2.5 space-y-2 text-xs sm:mt-3.5 sm:space-y-2.5 sm:text-sm">
              <li>
                <Link
                  to="/about#approach"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  Our approach
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  How it works
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenWaitlist}
                  className="cursor-pointer text-left text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  Join beta
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: FORGEIT (Compact on Mobile side-by-side with The Product) */}
          <div className="col-span-1 lg:col-span-2">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#E6C477] uppercase sm:text-xs">
              Forgeit
            </p>
            <ul className="mt-2.5 space-y-2 text-xs sm:mt-3.5 sm:space-y-2.5 sm:text-sm">
              <li>
                <Link
                  to="/"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: GET IN TOUCH */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#E6C477] uppercase sm:text-xs">
              Get in Touch
            </p>
            <div className="mt-2.5 flex flex-col items-start gap-1.5 text-xs sm:mt-3.5 sm:gap-2 sm:text-sm">
              <a
                href="tel:+918610336533"
                className="whitespace-nowrap font-mono text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
              >
                +91 86103 36533
              </a>
              <a
                href="mailto:info@forgeit.co.in"
                className="whitespace-nowrap text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
              >
                info@forgeit.co.in
              </a>
            </div>

            {pathname !== '/contact' && (
              <div className="mt-3 max-w-sm overflow-hidden rounded-xl border border-[#d4af37]/25 bg-[#032A1D] shadow-md sm:max-w-none">
                <div className="relative h-[95px] w-full sm:h-[105px]">
                  <iframe
                    src="https://www.google.com/maps?q=12.949805%2C80.245964&z=15&output=embed"
                    title="Teen Cabs Headquarters Map - Thoraipakkam, Chennai"
                    className="h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-[#285640]/60 bg-[#061a12]/95 px-2.5 py-1 text-[10px]">
                  <span className="truncate font-light text-[#B7C8BA]">
                    Thoraipakkam, Chennai
                  </span>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=12.949805,80.245964"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-0.5 font-medium text-[#E6C477] transition-colors hover:text-[#D9B45B] hover:underline"
                  >
                    <span>Directions</span>
                    <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FINAL BAR: COPYRIGHT, ATTRIBUTION & SOCIAL LINKS */}
        <div className="mt-6 flex flex-col gap-4 border-t border-[#285640]/60 pt-4 text-[#B7C8BA] sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:mt-10">
          <p className="text-[11px] leading-normal sm:text-xs">
            © 2026 Forgeit. All rights reserved.{' '}
            <span className="mx-1 text-[#E6C477]/60" aria-hidden="true">
              |
            </span>
            <span>
              Designed by{' '}
              <a
                href="https://mdk-portfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#E6C477] transition-colors hover:text-[#D9B45B] hover:underline"
              >
                Madhusudan
              </a>
              <span className="mx-1 text-[#E6C477]/60" aria-hidden="true">
                |
              </span>
              <a
                href="https://forgeit.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#E6C477] transition-colors hover:text-[#D9B45B] hover:underline"
              >
                Forgeit Groups
              </a>
            </span>
          </p>

          <div className="flex items-center gap-2.5">
            <a
              href="https://www.linkedin.com/company/forgeit-digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Forgeit Digital on LinkedIn"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#285640] bg-[#061a12] text-[#D4E1D8] transition-colors hover:border-[#E6C477] hover:bg-[#E6C477] hover:text-[#032A1D]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.38 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/forgeitgroups"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Forgeit Groups on Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#285640] bg-[#061a12] text-[#D4E1D8] transition-colors hover:border-[#E6C477] hover:bg-[#E6C477] hover:text-[#032A1D]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
              </svg>
            </a>
            <a
              href="https://x.com/forgeit_in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Forgeit on X"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#285640] bg-[#061a12] text-[#D4E1D8] transition-colors hover:border-[#E6C477] hover:bg-[#E6C477] hover:text-[#032A1D]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WaitlistFooterSection({ onOpenWaitlist }: WaitlistFooterSectionProps) {
  return (
    <div className="relative z-10">
      <WaitlistCtaSection onOpenWaitlist={onOpenWaitlist} />
      <SiteFooter onOpenWaitlist={onOpenWaitlist} />
    </div>
  );
}
