import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/teenCabsData';
import { BrandLogoMark } from './BrandLogoMark';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[#DFBA78] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#012B17] focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-[#0E5A35]/70 bg-[#012B17]/92 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-[1200px] items-center justify-between gap-8 px-6 sm:px-8 lg:px-10">
          {/* Zone 1: Official Twin-Chevron Brand Wordmark */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-lg font-bold tracking-tight text-[#DFBA78] transition-opacity hover:opacity-90"
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
                className="shrink-0 whitespace-nowrap text-sm font-medium tracking-wide text-[#CBE0D3] underline-offset-4 transition-colors duration-150 hover:text-[#DFBA78] hover:underline"
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
              className="hidden min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#DFBA78] px-5 py-2 text-sm font-semibold text-[#012B17] transition-colors duration-150 hover:bg-[#ECCD93] sm:inline-flex"
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
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl bg-[#02391F] text-[#F7F3E9] transition-colors hover:bg-[#054928] md:hidden"
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
        {mobileOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-[#0E5A35] bg-[#012B17] px-6 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-[#CBE0D3] transition-colors hover:bg-[#02391F] hover:text-[#DFBA78]"
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
                  className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#DFBA78] px-4 py-2.5 text-sm font-semibold text-[#012B17] transition-colors hover:bg-[#ECCD93]"
                >
                  <span>Get early access</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
