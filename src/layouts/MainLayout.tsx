import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import Lenis, { type ScrollToOptions } from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BackToTopButton } from '../components/BackToTopButton';
import { LivingAtmosphere } from '../components/LivingAtmosphere';
import { LogoIntro } from '../components/LogoIntro';
import { Navbar } from '../components/Navbar';
import { WaitlistModal } from '../components/WaitlistModal';
import { SiteFooter } from '../components/WaitlistFooterSection';
import { LenisContext, type ScrollTarget } from '../motion/LenisContext';

export interface MainLayoutOutletContext {
  onOpenWaitlist: () => void;
}

export function useMainLayoutContext() {
  return useOutletContext<MainLayoutOutletContext>();
}

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function MainLayout() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    getInitialReducedMotion
  );
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);
  const lockIdsRef = useRef<Set<string>>(new Set());
  const savedOverflowRef = useRef<{ body: string; html: string } | null>(null);
  const prefersReducedMotionRef = useRef<boolean>(prefersReducedMotion);
  const { pathname, hash } = useLocation();
  const routeSettleTokenRef = useRef(0);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  // Reactive OS prefers-reduced-motion listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const syncScrollLock = useCallback(() => {
    const locked = lockIdsRef.current.size > 0;

    if (locked) {
      lenisRef.current?.stop();
      if (savedOverflowRef.current === null) {
        savedOverflowRef.current = {
          body: document.body.style.overflow,
          html: document.documentElement.style.overflow,
        };
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
    } else {
      if (savedOverflowRef.current !== null) {
        document.body.style.overflow = savedOverflowRef.current.body;
        document.documentElement.style.overflow = savedOverflowRef.current.html;
        savedOverflowRef.current = null;
      }
      lenisRef.current?.start();
    }

    setIsScrollLocked(locked);
  }, []);

  const stopScroll = useCallback(
    (lockId = 'default') => {
      lockIdsRef.current.add(lockId);
      syncScrollLock();
    },
    [syncScrollLock]
  );

  const startScroll = useCallback(
    (lockId = 'default') => {
      lockIdsRef.current.delete(lockId);
      syncScrollLock();
    },
    [syncScrollLock]
  );

  // Restore document overflow if MainLayout unmounts while locked
  useEffect(() => {
    return () => {
      lockIdsRef.current.clear();
      if (savedOverflowRef.current !== null) {
        document.body.style.overflow = savedOverflowRef.current.body;
        document.documentElement.style.overflow = savedOverflowRef.current.html;
        savedOverflowRef.current = null;
      }
    };
  }, []);

  const scrollTo = useCallback(
    (target: ScrollTarget, options?: ScrollToOptions) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
        return;
      }

      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'auto' });
        return;
      }

      const offset = options?.offset ?? 0;
      const element =
        typeof target === 'string'
          ? target === '#top'
            ? null
            : document.querySelector<HTMLElement>(target)
          : target;

      if (!element) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY + offset);
      window.scrollTo({ top, behavior: 'auto' });
    },
    []
  );

  // Single Lenis instance synced with GSAP ticker, bypassed when reduced motion is enabled
  useEffect(() => {
    if (prefersReducedMotion) {
      lenisRef.current = null;
      setLenisInstance(null);
      const rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => window.cancelAnimationFrame(rafId);
    }

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    if (lockIdsRef.current.size > 0) {
      lenis.stop();
    }

    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    const refreshRaf = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshRaf);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [prefersReducedMotion]);

  // Global anchor links, custom scroll-to-top, and layout resize refresh
  useEffect(() => {
    const scrollToTopSmooth = () => {
      scrollTo(0, {
        duration: 1.25,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
    };

    const handleScrollTopEvent = () => {
      scrollToTopSmooth();
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!target) return;
      const targetHash = target.getAttribute('href');
      if (!targetHash || targetHash === '#') return;

      if (targetHash === '#top') {
        event.preventDefault();
        scrollToTopSmooth();
        return;
      }

      const el = document.querySelector<HTMLElement>(targetHash);
      if (!el) return;

      event.preventDefault();
      scrollTo(el, {
        offset: -68,
        duration: 1.25,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('teencabs:scroll-top', handleScrollTopEvent);

    const refresh = () => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', refresh);

    let resizeDebounceTimer: number | undefined;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (resizeDebounceTimer !== undefined) {
              window.clearTimeout(resizeDebounceTimer);
            }
            resizeDebounceTimer = window.setTimeout(refresh, 180);
          })
        : null;
    resizeObserver?.observe(document.body);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('teencabs:scroll-top', handleScrollTopEvent);
      window.removeEventListener('load', refresh);
      if (resizeDebounceTimer !== undefined) {
        window.clearTimeout(resizeDebounceTimer);
      }
      resizeObserver?.disconnect();
    };
  }, [scrollTo]);

  const settleRouteLayout = useCallback(
    async (targetHash: string, isCancelled: () => boolean) => {
      if (!targetHash) {
        scrollTo(0, { immediate: true, force: true });
      }

      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Proceed even if document.fonts.ready rejects
      }

      if (isCancelled()) return;

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      if (isCancelled()) return;

      if (targetHash) {
        const el = document.querySelector<HTMLElement>(targetHash);
        if (el) {
          scrollTo(el, {
            offset: -68,
            immediate: prefersReducedMotionRef.current,
            force: true,
          });
        } else {
          scrollTo(0, { immediate: true, force: true });
        }
      }

      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    },
    [scrollTo]
  );

  // Reset scroll / resolve hash target and refresh Lenis + ScrollTrigger on route and hash changes
  useEffect(() => {
    const token = ++routeSettleTokenRef.current;
    const isCancelled = () => routeSettleTokenRef.current !== token;
    void settleRouteLayout(hash, isCancelled);

    return () => {
      if (routeSettleTokenRef.current === token) {
        routeSettleTokenRef.current += 1;
      }
    };
  }, [pathname, hash, settleRouteLayout]);

  const handleOpenWaitlist = useCallback(() => setWaitlistOpen(true), []);
  const handleCloseWaitlist = useCallback(() => setWaitlistOpen(false), []);

  const lenisContextValue = useMemo(
    () => ({
      lenis: lenisInstance,
      prefersReducedMotion,
      isScrollLocked,
      stopScroll,
      startScroll,
      scrollTo,
    }),
    [
      lenisInstance,
      prefersReducedMotion,
      isScrollLocked,
      stopScroll,
      startScroll,
      scrollTo,
    ]
  );

  const outletContext = useMemo(
    () => ({ onOpenWaitlist: handleOpenWaitlist }),
    [handleOpenWaitlist]
  );

  return (
    <LenisContext.Provider value={lenisContextValue}>
      <div id="top" className="relative min-h-screen bg-[#063B27] text-[#E8EEE8]">
        <LogoIntro />
        <LivingAtmosphere />
        <Navbar onOpenWaitlist={handleOpenWaitlist} />

        <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
          <Outlet context={outletContext} />
        </main>

        <SiteFooter onOpenWaitlist={handleOpenWaitlist} />

        <WaitlistModal isOpen={waitlistOpen} onClose={handleCloseWaitlist} />
        {!waitlistOpen && <BackToTopButton />}
      </div>
    </LenisContext.Provider>
  );
}

