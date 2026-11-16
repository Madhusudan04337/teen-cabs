import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/teenCabsData';
import { BrandLogoMark } from './BrandLogoMark';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[#E6C477] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#032A1D] focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 transform-gpu border-b border-[#285640] bg-[#032A1D]/95 backdrop-blur-md will-change-transform">
        <div className="mx-auto flex h-[4.25rem] max-w-[1200px] items-center justify-between gap-8 px-6 sm:px-8 lg:px-10">
          {/* Zone 1: Official Twin-Chevron Brand Wordmark */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-lg font-bold tracking-tight text-[#E6C477] transition-opacity duration-200 ease-out hover:opacity-90"
          >
            <BrandLogoMark size={30} className="shrink-0" />
            <span>Teen Cabs</span>
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav aria-label="Primary" className="hidden items-center gap-5 lg:gap-7 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap text-sm font-medium tracking-wide text-[#D4E1D8] underline-offset-4 transition-colors duration-200 ease-out hover:text-[#E6C477] hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={onOpenWaitlist}
              className="hidden min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E6C477] px-5 py-2 text-sm font-semibold text-[#032A1D] transition-colors duration-200 ease-out hover:bg-[#D9B45B] sm:inline-flex"
            >
              <span>Get early access</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-[#285640] bg-[#0B4933] text-[#E8EEE8] transition-colors duration-200 ease-out hover:border-[#D9B45B] hover:text-[#E6C477] md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-[#285640] bg-[#032A1D] px-6 md:hidden"
            >
              <ul className="flex flex-col gap-1 py-4">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-[#D4E1D8] transition-colors duration-200 ease-out hover:bg-[#0B4933] hover:text-[#E6C477]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenWaitlist();
                    }}
                    className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#E6C477] px-4 py-2.5 text-sm font-semibold text-[#032A1D] transition-colors duration-200 ease-out hover:bg-[#D9B45B]"
                  >
                    <span>Get early access</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
