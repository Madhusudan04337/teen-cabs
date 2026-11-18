import { useState } from 'react';
import { Link } from 'react-router-dom';
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
                className="mx-auto mt-10 max-w-lg"
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
  return (
    <footer className="relative z-10 border-t border-[#285640]/50 bg-[#061a12] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-12">
        {/* TOP ROW: RESPONSIVE BALANCED GRID (2 COLS ON MOBILE, 12 ON DESKTOP) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Subtitle */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <BrandLogoMark
                size={26}
                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <div>
                <p className="text-lg font-bold tracking-tight text-[#E8EEE8] sm:text-xl">
                  Teen Cabs
                </p>
                <p className="font-mono text-[9px] font-medium tracking-[0.2em] text-[#B7C8BA] uppercase">
                  A Forgeit Groups Company
                </p>
              </div>
            </Link>

            <p className="mt-3 max-w-[34ch] text-xs leading-[1.65] font-light text-[#D4E1D8] sm:text-sm">
              A safe, supervised ride platform for teens. Built by
              Forgeit — Built Strong. Built Online.
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

          {/* Column 4: GET IN TOUCH + INTEGRATED MAP */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#E6C477] uppercase sm:text-xs">
              Get in Touch
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:mt-3.5 sm:block sm:space-y-2 sm:text-sm">
              <a
                href="tel:+918610336533"
                className="font-mono text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
              >
                +91 86103 36533
              </a>
              <span aria-hidden="true" className="text-[#285640] sm:hidden">
                ·
              </span>
              <a
                href="mailto:info@forgeit.co.in"
                className="text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
              >
                info@forgeit.co.in
              </a>
            </div>

            {/* Small Integrated Google Maps Frame */}
            <div className="mt-3 overflow-hidden rounded-xl border border-[#d4af37]/25 bg-[#032A1D] shadow-md max-w-sm sm:max-w-none">
              <div className="relative h-[95px] sm:h-[105px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3888.3443265010474!2d80.245964!3d12.949805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU2JzU5LjMiTiA4MMKwMTQnNDUuNSJF!5e0!3m2!1sen!2sin!4v1795019924495!5m2!1sen!2sin"
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
          </div>
        </div>

        {/* HAIRLINE DIVIDER */}
        <div className="mt-8 border-t border-[#285640]/60 sm:mt-12 lg:mt-14" />

        {/* BOTTOM ROW: COPYRIGHT & FORGEIT EXTERNAL LINK */}
        <div className="mt-4 flex flex-col gap-2.5 text-xs text-[#B7C8BA] sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[11px] sm:text-xs leading-normal">
            © 2026 Teen Cabs — A Forgeit Product. Designed by{' '}
            <span className="font-semibold text-[#E6C477]">Madhusudan</span> ·
            All rights reserved.
          </p>

          <a
            href="https://forgeit.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#D4E1D8] transition-colors hover:text-[#E6C477]"
          >
            <span>forgeit.co.in</span>
            <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          </a>
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
