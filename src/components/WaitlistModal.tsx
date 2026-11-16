import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
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

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-md rounded-3xl border border-[#0E5A35] bg-[#02391F] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#9BC5AD] uppercase">
              Early Access Beta
            </p>
            <h2
              id={headingId}
              className="mt-1 text-2xl font-bold tracking-tight text-[#F7F3E9]"
            >
              Join the Teen Cabs waitlist
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close early access dialog"
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-full bg-[#012B17] text-[#CBE0D3] transition-colors hover:text-[#DFBA78]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div role="status" className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-[#012B17] p-4">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-[#82CFA0]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-[#F7F3E9]">
                  You’re on the early access list, {name.trim()}.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#CBE0D3]">
                  We’ve reserved a {role === 'parent' ? 'Parent & Family' : 'Teen'} beta
                  invite for <span className="font-mono text-[#DFBA78]">{email.trim()}</span>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="min-h-[44px] w-full cursor-pointer rounded-full bg-[#DFBA78] px-4 py-2.5 text-sm font-semibold text-[#012B17] transition-colors hover:bg-[#ECCD93]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-[#CBE0D3]">
                I am signing up as a
              </legend>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#012B17] p-1">
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  aria-pressed={role === 'parent'}
                  className={`min-h-[40px] cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    role === 'parent'
                      ? 'bg-[#054928] text-[#DFBA78]'
                      : 'text-[#9BC5AD] hover:text-[#F7F3E9]'
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
                      ? 'bg-[#054928] text-[#DFBA78]'
                      : 'text-[#9BC5AD] hover:text-[#F7F3E9]'
                  }`}
                >
                  Teen (13–18)
                </button>
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="modal-name"
                className="mb-1.5 block text-xs font-semibold text-[#CBE0D3]"
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
                className="min-h-[44px] w-full rounded-xl bg-[#012B17] px-3.5 py-2.5 text-sm text-[#F7F3E9] placeholder:text-[#78A68C] focus:ring-2 focus:ring-[#DFBA78]"
              />
            </div>

            <div>
              <label
                htmlFor="modal-email"
                className="mb-1.5 block text-xs font-semibold text-[#CBE0D3]"
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
                className="min-h-[44px] w-full rounded-xl bg-[#012B17] px-3.5 py-2.5 text-sm text-[#F7F3E9] placeholder:text-[#78A68C] focus:ring-2 focus:ring-[#DFBA78]"
              />
            </div>

            {error && (
              <p
                id={errorId}
                role="alert"
                className="rounded-xl border border-amber-400/40 bg-amber-950/40 px-3 py-2 text-xs font-medium text-amber-200"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="min-h-[46px] w-full cursor-pointer rounded-full bg-[#DFBA78] px-5 py-3 text-sm font-semibold text-[#012B17] transition-colors hover:bg-[#ECCD93]"
            >
              Reserve beta access
            </button>

            <p className="text-center text-xs text-[#9BC5AD]">
              No spam, no commitment. Just early beta invites.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
