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
        className="relative overflow-hidden border-t border-[#d4af37]/12 bg-transparent py-20 sm:py-24 lg:py-32"
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
                className="mx-auto mt-10 inline-flex items-center justify-center gap-3 rounded-full border border-[#285640] bg-[#032A1D] px-7 py-4 text-sm font-medium text-[#E8EEE8] shadow-lg shadow-black/30"
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
                    className="min-h-[50px] flex-1 rounded-full border border-[#285640] bg-[#032A1D] px-6 py-3.5 text-sm text-[#E8EEE8] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
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
                    className="mt-3 rounded-xl border border-[#D9B45B]/55 bg-[#032A1D] px-4 py-2.5 text-center text-xs font-semibold text-[#E6C477] sm:text-left"
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
    <footer className="relative z-10 border-t border-[#E6C477]/20 bg-[#061a12] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        {/* PART 2 — SITE FOOTER (Spacious Asymmetric Editorial Grid on Desktop, Intentional Grouping on Mobile) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Brand Identity & Manifesto */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <BrandLogoMark size={32} className="shrink-0" />
              <div>
                <p className="text-lg font-bold tracking-tight text-[#E6C477]">Teen Cabs</p>
                <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-[#B7C8BA] uppercase">
                  A Forgeit Groups Company
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-[38ch] text-sm leading-[1.78] font-light text-[#D4E1D8]">
              A safe, supervised ride platform for teens. Built by Forgeit —
              Built Strong. Built Online.
            </p>
          </div>

          {/* Middle: Organized Product & Company Navigation */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
                The Product
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <Link
                    to="/about#our-approach"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    Our approach
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenWaitlist}
                    className="cursor-pointer text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    Join beta
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
                Forgeit
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/team"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Direct Verified Contact Channels */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#E6C477] uppercase">
              Get in Touch
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+918610336533"
                  className="font-mono text-xs tracking-wide text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                >
                  +91 86103 36533
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@forgeit.co.in"
                  className="text-sm font-medium text-[#D4E1D8] underline-offset-4 transition-colors hover:text-[#E6C477] hover:underline"
                >
                  info@forgeit.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Signature & Copyright Bar */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#E6C477]/15 pt-8 text-xs text-[#B7C8BA]">
          <p>
            © {new Date().getFullYear()} Teen Cabs — A Forgeit Product. Designed by{' '}
            <a
              href="https://mdk-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E6C477] underline-offset-4 hover:text-[#D9B45B] hover:underline"
            >
              Madhusudan
            </a>{' '}
            · All rights reserved.
          </p>
          <a
            href="https://forgeit.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
          >
            <span>forgeit.co.in</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
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
