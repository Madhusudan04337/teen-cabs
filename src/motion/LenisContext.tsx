import { createContext, useContext } from 'react';
import type Lenis from 'lenis';
import type { ScrollToOptions } from 'lenis';

export type ScrollTarget = number | string | HTMLElement;

export interface LenisContextValue {
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
  isScrollLocked: boolean;
  stopScroll: (lockId?: string) => void;
  startScroll: (lockId?: string) => void;
  scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void;
}

const noop = () => {};

export const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  prefersReducedMotion: false,
  isScrollLocked: false,
  stopScroll: noop,
  startScroll: noop,
  scrollTo: noop,
});

export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}
