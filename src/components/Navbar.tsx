import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  Home,
  Mail,
  Route,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { NAV_LINKS } from '../data/teenCabsData';
import { BrandLogoMark } from './BrandLogoMark';

interface NavbarProps {
  onOpenWaitlist: () => void;
}

const ROUTE_ICONS: Record<string, typeof Home> = {
  '/': Home,
  '/about': Compass,
  '/features': ShieldCheck,
  '/how-it-works': Route,
  '/team': Users,
  '/contact': Mail,
};

function AnimatedMenuIcon({
  isOpen,
  prefersReducedMotion,
}: {
  isOpen: boolean;
  prefersReducedMotion: boolean | null;
}) {
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <motion.span
        initial={false}
        animate={isOpen ? { y: 0, rotate: 45 } : { y: -5.5, rotate: 0 }}
        transition={transition}
        className="absolute h-[1.75px] w-[18px] rounded-full bg-current"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }}
        transition={transition}
        className="absolute h-[1.75px] w-[18px] rounded-full bg-current"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { y: 0, rotate: -45 } : { y: 5.5, rotate: 0 }}
        transition={transition}
        className="absolute h-[1.75px] w-[18px] rounded-full bg-current"
      />
    </span>
  );
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { pathname } = useLocation();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const skipFocusRestoreRef = useRef(false);

  useEffect(() => {
    skipFocusRestoreRef.current = true;
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
    }, 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        skipFocusRestoreRef.current = false;
        setMobileOpen(false);
        return;
      }

      if (event.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!active || active === first || !drawerRef.current.contains(active)) {
            event.preventDefault();
            last.focus({ preventScroll: true });
          }
        } else if (!active || active === last || !drawerRef.current.contains(active)) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      if (!skipFocusRestoreRef.current) {
        triggerRef.current?.focus({ preventScroll: true });
      }
      skipFocusRestoreRef.current = false;
    };
  }, [mobileOpen]);

  const handleNavClick = (to: string) => {
    skipFocusRestoreRef.current = true;
    setMobileOpen(false);
    if (pathname === to) {
      window.dispatchEvent(new CustomEvent('teencabs:scroll-top'));
    }
  };

  const handleManualClose = () => {
    skipFocusRestoreRef.current = false;
    setMobileOpen(false);
  };

  const handleOpenWaitlistFromDrawer = () => {
    skipFocusRestoreRef.current = true;
    setMobileOpen(false);
    onOpenWaitlist();
  };

  const offCanvasPortal =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-nav-backdrop"
                aria-hidden="true"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, pointerEvents: 'none' }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                onClick={handleManualClose}
                className="fixed inset-0 z-[60] touch-none bg-[#021A11]/72 lg:hidden"
              />
            )}

            {mobileOpen && (
              <motion.div
                key="mobile-nav-drawer"
                ref={drawerRef}
                id="mobile-navigation"
                data-lenis-prevent
                role="dialog"
                aria-modal="true"
                aria-label="Mobile and tablet navigation"
                initial={prefersReducedMotion ? false : { x: '100%' }}
                animate={{ x: 0 }}
                exit={prefersReducedMotion ? undefined : { x: '100%', pointerEvents: 'none' }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-y-0 right-0 z-[61] flex w-[76vw] max-w-[280px] transform-gpu flex-col border-l border-[#285640] bg-[#032A1D] shadow-2xl shadow-black/75 will-change-transform lg:hidden"
              >
                {/* Drawer Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#285640]/70 px-5 sm:h-[4.25rem]">
                  <Link
                    to="/"
                    onClick={() => handleNavClick('/')}
                    className="flex touch-manipulation items-center gap-2.5 text-base font-bold tracking-tight text-[#E6C477]"
                  >
                    <BrandLogoMark size={26} className="shrink-0" />
                    <span>Teen Cabs</span>
                  </Link>

                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={handleManualClose}
                    aria-label="Close navigation menu"
                    className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation cursor-pointer items-center justify-center rounded-xl border border-[#285640] bg-[#063B27] text-[#E8EEE8] transition-colors duration-150 hover:border-[#D9B45B] hover:text-[#E6C477]"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Clean Vertical Navigation Links */}
                <nav
                  aria-label="Mobile and tablet routes"
                  className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-5"
                >
                  <ul className="flex flex-col gap-1.5">
                    {NAV_LINKS.map((item) => {
                      const Icon = ROUTE_ICONS[item.to] ?? Compass;
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end={item.to === '/'}
                            onClick={() => handleNavClick(item.to)}
                            className={({ isActive }) =>
                              `group flex min-h-[46px] touch-manipulation items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors duration-150 ${
                                isActive
                                  ? 'bg-[#0B4933] text-[#E6C477]'
                                  : 'text-[#D4E1D8] hover:bg-[#063B27] hover:text-[#E6C477]'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <span className="flex items-center gap-3">
                                  <Icon
                                    className={`h-[17px] w-[17px] shrink-0 transition-colors ${
                                      isActive
                                        ? 'text-[#E6C477]'
                                        : 'text-[#87958B] group-hover:text-[#D9B45B]'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  <span>{item.label}</span>
                                </span>

                                <ChevronRight
                                  className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 ${
                                    isActive
                                      ? 'text-[#E6C477]'
                                      : 'text-[#547064] group-hover:text-[#E6C477]'
                                  }`}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Bottom CTA Footer */}
                <div className="shrink-0 border-t border-[#285640]/70 px-4 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
                  <button
                    type="button"
                    onClick={handleOpenWaitlistFromDrawer}
                    className="flex min-h-[46px] w-full touch-manipulation cursor-pointer items-center justify-center gap-2 rounded-full bg-[#E6C477] px-5 py-2.5 text-sm font-semibold text-[#032A1D] transition-colors duration-150 hover:bg-[#D9B45B] active:scale-[0.98]"
                  >
                    <span>Get early access</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-md focus:bg-[#E6C477] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#032A1D] focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-[#d4af37]/15 bg-[#061a12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6 sm:h-[4.25rem] sm:px-8 lg:gap-8 lg:px-10">
          {/* Zone 1: Official Twin-Chevron Brand Wordmark */}
          <Link
            to="/"
            onClick={() => handleNavClick('/')}
            className="flex shrink-0 touch-manipulation items-center gap-2.5 whitespace-nowrap text-lg font-bold tracking-tight text-[#E6C477] transition-opacity duration-200 ease-out hover:opacity-90"
          >
            <BrandLogoMark size={30} className="shrink-0" />
            <span>Teen Cabs</span>
          </Link>

          {/* Zone 2: Concise single-line navigation links (1024px+ only to prevent tablet overflow) */}
          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => handleNavClick(item.to)}
                className={({ isActive }) =>
                  `shrink-0 whitespace-nowrap text-sm font-medium tracking-wide underline-offset-4 transition-colors duration-200 ease-out hover:text-[#E6C477] hover:underline ${
                    isActive ? 'text-[#E6C477] underline' : 'text-[#D4E1D8]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action & Morphing Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={onOpenWaitlist}
              className="hidden min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E6C477] px-5 py-2 text-sm font-semibold text-[#032A1D] transition-colors duration-200 ease-out hover:bg-[#D9B45B] lg:inline-flex"
            >
              <span>Get early access</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`inline-flex min-h-[44px] min-w-[44px] touch-manipulation cursor-pointer items-center justify-center rounded-xl border transition-colors duration-150 ease-out lg:hidden ${
                mobileOpen
                  ? 'border-[#E6C477]/70 bg-[#0B4933] text-[#E6C477]'
                  : 'border-[#285640] bg-[#063B27] text-[#E8EEE8] hover:border-[#D9B45B] hover:text-[#E6C477]'
              }`}
            >
              <AnimatedMenuIcon
                isOpen={mobileOpen}
                prefersReducedMotion={prefersReducedMotion}
              />
            </button>
          </div>
        </div>
      </header>

      {offCanvasPortal}
    </>
  );
}

