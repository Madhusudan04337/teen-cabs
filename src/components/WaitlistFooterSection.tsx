import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BrandLogoMark } from './BrandLogoMark';

interface WaitlistFooterSectionProps {
  onOpenWaitlist: () => void;
}

export function WaitlistFooterSection({ onOpenWaitlist }: WaitlistFooterSectionProps) {
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
      {/* Section 7: Open Canvas Final CTA */}
      <section
        id="waitlist"
        aria-labelledby="waitlist-heading"
        className="relative overflow-hidden border-t border-[#285640] bg-[#063B27] py-20 sm:py-24 lg:py-28"
      >
        <div
          aria-hidden="true"
          className="animate-living-breath pointer-events-none absolute top-1/2 left-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full bg-[radial-gradient(circle,rgba(230,196,119,0.08)_0%,transparent_66%)]"
        />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
              Your next ride starts here
            </p>
            <h2
              id="waitlist-heading"
              className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
            >
              Be among the first to{' '}
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                experience Teen Cabs.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-base leading-[1.65] font-light text-[#D4E1D8] sm:text-[1.0625rem]">
              We’re opening early access to a select group of families. Join the
              waitlist and help shape the future of supervised teen mobility.
            </p>

            {joined ? (
              <div
                role="status"
                className="mx-auto mt-9 inline-flex items-center justify-center gap-2.5 rounded-full border border-[#285640] bg-[#0B4933] px-6 py-4 text-sm font-medium text-[#E8EEE8]"
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
                className="mx-auto mt-9 max-w-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
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
                    className="min-h-[48px] flex-1 rounded-full border border-[#285640] bg-[#0B4933] px-5 py-3 text-sm text-[#E8EEE8] placeholder:text-[#B7C8BA] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-[48px] shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#E6C477] px-7 py-3 text-sm font-semibold text-[#032A1D] transition-colors hover:bg-[#D9B45B]"
                  >
                    <span>Join the beta</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {error && (
                  <p
                    id="footer-waitlist-error"
                    role="alert"
                    className="mt-2.5 rounded-xl border border-[#D9B45B]/55 bg-[#032A1D] px-3.5 py-2 text-center text-xs font-medium text-[#E6C477] sm:text-left"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-[#B7C8BA]">
                  <span>No spam, no commitment. Just early access.</span>
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

      {/* Quiet Open Footer */}
      <footer className="border-t border-[#285640] bg-[#032A1D] py-14 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <BrandLogoMark size={30} className="shrink-0" />
                <div>
                  <p className="text-base font-bold text-[#E6C477]">Teen Cabs</p>
                  <p className="text-xs text-[#B7C8BA]">A Forgeit Groups Company</p>
                </div>
              </div>

              <p className="mt-4 max-w-[34ch] text-sm leading-[1.65] font-light text-[#D4E1D8]">
                A safe, supervised ride platform for teens. Built by Forgeit —
                Built Strong. Built Online.
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
                The Product
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="#our-approach"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    Our approach
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenWaitlist}
                    className="cursor-pointer text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    Join beta
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
                Forgeit
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="#top"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#the-need"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#team"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
                Get in Touch
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="tel:+918610336533"
                    className="font-mono text-xs text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    +91 86103 36533
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@forgeit.co.in"
                    className="text-[#D4E1D8] underline-offset-4 hover:text-[#E6C477] hover:underline"
                  >
                    info@forgeit.co.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#285640] pt-8 text-xs text-[#B7C8BA]">
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
    </div>
  );
}
