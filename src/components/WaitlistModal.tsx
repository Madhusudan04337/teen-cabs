import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { useLenis } from '../motion/LenisContext';
import { Flip, gsap, useGSAP } from '../motion/setup';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const { stopScroll, startScroll } = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const [role, setRole] = useState<'parent' | 'teen'>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headingId = useId();
  const errorId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  const captureModalFlip = useCallback(() => {
    if (prefersReducedMotion || !dialogRef.current) return;
    const targets = dialogRef.current.querySelectorAll('[data-flip-id]');
    if (targets.length > 0) {
      flipStateRef.current = Flip.getState(targets);
    }
  }, [prefersReducedMotion]);

  useGSAP(
    () => {
      if (!isOpen || prefersReducedMotion || !flipStateRef.current || !dialogRef.current) return;
      const state = flipStateRef.current;
      flipStateRef.current = null;

      Flip.from(state, {
        targets: dialogRef.current.querySelectorAll('[data-flip-id]'),
        duration: 0.36,
        ease: 'power3.out',
        fade: true,
        nested: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
          ),
      });
    },
    { scope: dialogRef, dependencies: [isOpen, role, submitted, prefersReducedMotion] }
  );

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    stopScroll('waitlist-modal');

    const focusTimer = window.setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      } else {
        dialogRef.current?.focus();
      }
    }, 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
          if (!active || active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (!active || active === last || !dialogRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      startScroll('waitlist-modal');
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, stopScroll, startScroll]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    captureModalFlip();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    flipStateRef.current = null;
    setSubmitted(false);
    setName('');
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-lenis-prevent
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#032A1D]/80 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleResetAndClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            data-flip-id="waitlist-dialog"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#285640] bg-[#063B27] p-5 text-[#E8EEE8] shadow-2xl focus:outline-none sm:p-7"
          >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
              Early Access Beta
            </p>
            <h2
              id={headingId}
              className="mt-1 text-2xl font-bold tracking-tight text-[#E8EEE8]"
            >
              Join the Teen Cabs waitlist
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close early access dialog"
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-lg border border-[#285640] bg-[#032A1D] text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div data-flip-id="waitlist-panel" role="status" className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-[#285640] bg-[#032A1D] p-4">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-[#E6C477]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-[#E8EEE8]">
                  You’re on the early access list, {name.trim()}.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#D4E1D8]">
                  We’ve reserved a {role === 'parent' ? 'Parent & Family' : 'Teen'} beta
                  invite for <span className="font-mono text-[#E6C477]">{email.trim()}</span>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="min-h-[44px] w-full cursor-pointer rounded-lg bg-[#E6C477] px-4 py-2.5 text-sm font-semibold text-[#032A1D] transition-colors hover:bg-[#D9B45B]"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            data-flip-id="waitlist-panel"
            onSubmit={handleSubmit}
            noValidate
            className="waitlist-dark-form mt-6 space-y-5"
          >
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-[#D4E1D8]">
                I am signing up as a
              </legend>
              <div className="relative grid grid-cols-2 gap-2 rounded-2xl border border-[#285640] bg-[#032A1D] p-1">
                <button
                  type="button"
                  onClick={() => {
                    if (role === 'parent') return;
                    captureModalFlip();
                    setRole('parent');
                  }}
                  aria-pressed={role === 'parent'}
                  className={`relative min-h-[42px] cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    role === 'parent'
                      ? 'text-[#E6C477]'
                      : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                  }`}
                >
                  {role === 'parent' && (
                    <span
                      data-flip-id="waitlist-role-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-[#0B4933] shadow-sm ring-1 ring-[#E6C477]/20"
                    />
                  )}
                  <span className="relative z-10">Parent / Guardian</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (role === 'teen') return;
                    captureModalFlip();
                    setRole('teen');
                  }}
                  aria-pressed={role === 'teen'}
                  className={`relative min-h-[42px] cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    role === 'teen'
                      ? 'text-[#E6C477]'
                      : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                  }`}
                >
                  {role === 'teen' && (
                    <span
                      data-flip-id="waitlist-role-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-[#0B4933] shadow-sm ring-1 ring-[#E6C477]/20"
                    />
                  )}
                  <span className="relative z-10">Teen (13–18)</span>
                </button>
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="modal-name"
                className="mb-1.5 block text-xs font-semibold text-[#D4E1D8]"
              >
                Full name
              </label>
              <input
                ref={nameInputRef}
                id="modal-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(error && !name.trim())}
                aria-describedby={error ? errorId : undefined}
                placeholder="e.g. Priya Sharma"
                className="min-h-[44px] w-full rounded-lg border border-[#285640] bg-[#032A1D] px-3.5 py-2.5 text-sm text-[#E8EEE8] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="modal-email"
                className="mb-1.5 block text-xs font-semibold text-[#D4E1D8]"
              >
                Email address
              </label>
              <input
                id="modal-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                placeholder="you@example.com"
                className="min-h-[44px] w-full rounded-lg border border-[#285640] bg-[#032A1D] px-3.5 py-2.5 text-sm text-[#E8EEE8] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
              />
            </div>

            {error && (
              <p
                id={errorId}
                role="alert"
                className="rounded-lg border border-[#D9B45B]/60 bg-[#032A1D] px-3 py-2 text-xs font-medium text-[#E6C477]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="min-h-[46px] w-full cursor-pointer rounded-lg bg-[#E6C477] px-5 py-3 text-sm font-semibold text-[#032A1D] transition-colors hover:bg-[#D9B45B]"
            >
              Reserve beta access
            </button>

            <p className="text-center text-xs text-[#B7C8BA]">
              No spam, no commitment. Just early beta invites.
            </p>
          </form>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
