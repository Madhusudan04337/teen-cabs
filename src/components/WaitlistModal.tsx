import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [role, setRole] = useState<'parent' | 'teen'>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headingId = useId();
  const errorId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    nameInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

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
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
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
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#032A1D]/80 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleResetAndClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-3xl border border-[#285640] bg-[#0B4933] p-6 shadow-2xl sm:p-8"
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
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-full border border-[#285640] bg-[#032A1D] text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div role="status" className="mt-6 space-y-4">
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
              className="min-h-[44px] w-full cursor-pointer rounded-full bg-[#E6C477] px-4 py-2.5 text-sm font-semibold text-[#032A1D] transition-colors hover:bg-[#D9B45B]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-[#D4E1D8]">
                I am signing up as a
              </legend>
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#285640] bg-[#032A1D] p-1">
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  aria-pressed={role === 'parent'}
                  className={`min-h-[40px] cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    role === 'parent'
                      ? 'bg-[#0B4933] text-[#E6C477]'
                      : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                  }`}
                >
                  Parent / Guardian
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teen')}
                  aria-pressed={role === 'teen'}
                  className={`min-h-[40px] cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    role === 'teen'
                      ? 'bg-[#0B4933] text-[#E6C477]'
                      : 'text-[#B7C8BA] hover:text-[#E8EEE8]'
                  }`}
                >
                  Teen (13–18)
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
                className="min-h-[44px] w-full rounded-xl border border-[#285640] bg-[#032A1D] px-3.5 py-2.5 text-sm text-[#E8EEE8] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
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
                className="min-h-[44px] w-full rounded-xl border border-[#285640] bg-[#032A1D] px-3.5 py-2.5 text-sm text-[#E8EEE8] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
              />
            </div>

            {error && (
              <p
                id={errorId}
                role="alert"
                className="rounded-xl border border-[#D9B45B]/60 bg-[#032A1D] px-3 py-2 text-xs font-medium text-[#E6C477]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="min-h-[46px] w-full cursor-pointer rounded-full bg-[#E6C477] px-5 py-3 text-sm font-semibold text-[#032A1D] transition-colors hover:bg-[#D9B45B]"
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
