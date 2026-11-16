import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          title="Back to top"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-5 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] z-50 inline-flex h-11 w-11 transform-gpu items-center justify-center rounded-full border border-[#285640] bg-[#0B4933]/95 text-[#E6C477] shadow-xl shadow-black/40 backdrop-blur-sm transition-colors duration-200 ease-out hover:border-[#D9B45B] hover:bg-[#E6C477] hover:text-[#032A1D] sm:right-8 sm:bottom-8"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
