import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
} from 'lucide-react';

const INQUIRY_TOPICS = [
  'Parent & Family',
  'School Partnership',
  'Driver Vetting',
  'General Inquiry',
] as const;

type InquiryTopic = (typeof INQUIRY_TOPICS)[number];

// TODO: Configure verified Teen Cabs / Forgeit social profile URLs before linking externally.
const SOCIAL_PROFILES: ReadonlyArray<{
  name: string;
  href: string | null;
  icon: React.ReactNode;
}> = [
  {
    name: 'LinkedIn',
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.38 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);
  const [copyErrorField, setCopyErrorField] = useState<'phone' | 'email' | null>(null);
  const [topic, setTopic] = useState<InquiryTopic>('Parent & Family');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.innerWidth >= 768;
        const offset = isDesktop ? 36 : 16;

        gsap.fromTo(
          '[data-contact-left]',
          { x: -offset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'bottom 4%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          '[data-contact-right]',
          { x: offset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'bottom 4%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const handleCopy = async (field: 'phone' | 'email', text: string) => {
    setCopyErrorField(null);

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        window.setTimeout(() => {
          setCopiedField((prev) => (prev === field ? null : prev));
        }, 2000);
        return;
      } catch {
        // Fall through to execCommand copy attempt before reporting failure
      }
    }

    let fallbackSucceeded = false;
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      fallbackSucceeded = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      fallbackSucceeded = false;
    }

    if (fallbackSucceeded) {
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 2000);
    } else {
      setCopiedField(null);
      setCopyErrorField(field);
      window.setTimeout(() => {
        setCopyErrorField((prev) => (prev === field ? null : prev));
      }, 3000);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 8) {
      setError('Please share a brief note about your question or inquiry.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setMessage('');
    setError('');
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative z-10 border-t border-[#285640] bg-[#032A1D] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Open Contact Channels & Studio Address */}
          <div data-contact-left className="lg:col-span-5">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#D4E1D8]">
              Contact Teen Cabs
            </p>
            <h2
              id="contact-heading"
              className="text-balance text-3xl leading-[1.12] font-semibold tracking-[-0.02em] text-[#E8EEE8] sm:text-4xl lg:text-[3rem]"
            >
              Let’s talk.
              <span className="font-editorial block font-normal italic text-[#E6C477]">
                Built for families.
              </span>
            </h2>
            <p className="mt-5 max-w-[44ch] rounded-2xl border border-[#285640] bg-[#0B4933] px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
              Questions about teen onboarding, school partnerships, or driver
              safety standards? Reach our Chennai team directly.
            </p>

            {/* Open Hairline Directory */}
            <dl className="mt-9 divide-y divide-[#285640] border-y border-[#285640]">
              <div className="flex items-center justify-between gap-4 py-5">
                <div className="flex min-w-0 items-start gap-3.5">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#E6C477]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
                      Phone &amp; WhatsApp
                    </dt>
                    <dd className="mt-1">
                      <a
                        href="tel:+918610336533"
                        className="font-mono text-sm font-medium text-[#E8EEE8] transition-colors hover:text-[#E6C477] sm:text-base"
                      >
                        +91 86103 36533
                      </a>
                    </dd>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('phone', '+918610336533')}
                  aria-label="Copy phone number"
                  className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#285640] bg-[#0B4933] px-3.5 py-2 text-xs font-medium text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477] sm:min-h-[38px] sm:py-1.5"
                >
                  {copiedField === 'phone' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#E6C477]" aria-hidden="true" />
                      <span className="text-[#E6C477]">Copied</span>
                    </>
                  ) : copyErrorField === 'phone' ? (
                    <span className="text-[#E6C477]">Copy failed</span>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <div className="flex min-w-0 items-start gap-3.5">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#E6C477]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
                      Direct Email
                    </dt>
                    <dd className="mt-1 truncate">
                      <a
                        href="mailto:info@forgeit.co.in"
                        className="text-sm font-medium text-[#E8EEE8] transition-colors hover:text-[#E6C477] sm:text-base"
                      >
                        info@forgeit.co.in
                      </a>
                    </dd>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('email', 'info@forgeit.co.in')}
                  aria-label="Copy email address"
                  className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#285640] bg-[#0B4933] px-3.5 py-2 text-xs font-medium text-[#D4E1D8] transition-colors hover:border-[#D9B45B] hover:text-[#E6C477] sm:min-h-[38px] sm:py-1.5"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#E6C477]" aria-hidden="true" />
                      <span className="text-[#E6C477]">Copied</span>
                    </>
                  ) : copyErrorField === 'email' ? (
                    <span className="text-[#E6C477]">Copy failed</span>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="py-5">
                <div className="flex items-start gap-3.5">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#E6C477]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-wider text-[#B7C8BA] uppercase">
                      Office Address
                    </dt>
                    <dd className="mt-1.5 text-sm leading-[1.65] font-light text-[#D4E1D8]">
                      No. 14, Prabhu Nagar, Neelankarai Link Rd, Murgeshan Nagar,
                      Subbarayan Nagar, Thoraipakkam, Chennai, Tamil Nadu 600097
                    </dd>
                    <a
                      href="https://maps.google.com/?q=No.14+Prabhu+Nagar+Neelankarai+Link+Rd+Thoraipakkam+Chennai+600097"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-[44px] items-center gap-1 py-2 text-xs font-semibold text-[#E6C477] underline-offset-4 hover:text-[#D9B45B] hover:underline sm:min-h-[36px]"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-[#D4E1D8]">
                  <Clock className="h-4 w-4 text-[#E6C477]" aria-hidden="true" />
                  <span>Response within 24 hours</span>
                </div>

                <div className="flex items-center gap-2.5">
                  {SOCIAL_PROFILES.map((social) =>
                    social.href ? (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Forgeit & Teen Cabs on ${social.name}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#285640] bg-[#0B4933] text-[#D4E1D8] transition-colors hover:border-[#E6C477] hover:bg-[#E6C477] hover:text-[#032A1D]"
                      >
                        {social.icon}
                      </a>
                    ) : (
                      <span
                        key={social.name}
                        aria-label={`${social.name} profile link pending configuration`}
                        title={`${social.name} profile URL pending manual configuration`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#285640] bg-[#0B4933]/60 text-[#B7C8BA] opacity-70"
                      >
                        {social.icon}
                      </span>
                    )
                  )}
                </div>
              </div>
            </dl>
          </div>

          {/* Right Column: Warm Ivory Inquiry Sheet (#F3F0E6) with High-Contrast Forest Green Ink (#063B27) */}
          <div data-contact-right className="lg:col-span-7">
            <div className="rounded-3xl border border-[#D8D9C9] bg-[#F3F0E6] p-6 text-[#063B27] shadow-2xl shadow-black/45 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#D8D9C9] pb-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#547064] uppercase">
                    Direct Message
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#063B27]">
                    Send an inquiry
                  </h3>
                </div>
                <span className="text-xs font-medium text-[#547064]">
                  Direct review by Forgeit team
                </span>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="submitted"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    role="status"
                    className="py-10 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D8D9C9] bg-[#FFFFFF] text-[#063B27]">
                      <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h4 className="mt-5 text-xl font-semibold text-[#063B27]">
                      Message received, {fullName.trim()}
                    </h4>
                    <p className="mx-auto mt-2 max-w-[40ch] text-sm leading-relaxed text-[#547064]">
                      Our team will review your <span className="font-semibold text-[#063B27]">{topic}</span> note
                      and reply to <span className="font-mono text-[#063B27]">{email.trim()}</span> within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-7 inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full bg-[#063B27] px-6 py-2.5 text-xs font-semibold text-[#E6C477] transition-colors hover:bg-[#032A1D]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Send another message</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-6 space-y-5"
                  >
                    {/* Topic Selector Buttons */}
                    <fieldset>
                      <legend className="mb-2.5 text-xs font-semibold tracking-wider text-[#547064] uppercase">
                        Inquiry focus
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {INQUIRY_TOPICS.map((item) => {
                          const active = topic === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setTopic(item)}
                              aria-pressed={active}
                              className={`min-h-[44px] cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:min-h-[38px] sm:py-1.5 ${
                                active
                                  ? 'bg-[#063B27] text-[#E6C477]'
                                  : 'border border-[#D8D9C9] bg-[#FFFFFF] text-[#063B27] hover:bg-[#E8EEE8]'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block text-xs font-semibold text-[#063B27]"
                        >
                          Full Name <span className="text-[#547064]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Anand Sundaram"
                          className="min-h-[46px] w-full rounded-xl border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1.5 block text-xs font-semibold text-[#063B27]"
                        >
                          Email Address <span className="text-[#547064]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="min-h-[46px] w-full rounded-xl border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1.5 block text-xs font-semibold text-[#063B27]"
                        >
                          Phone / WhatsApp
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="min-h-[46px] w-full rounded-xl border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-org"
                          className="mb-1.5 block text-xs font-semibold text-[#063B27]"
                        >
                          School or Organization
                        </label>
                        <input
                          id="contact-org"
                          type="text"
                          autoComplete="organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Optional"
                          className="min-h-[46px] w-full rounded-xl border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-xs font-semibold text-[#063B27]"
                      >
                        Your Message <span className="text-[#547064]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your questions, school commute needs, or partnership details..."
                        className="w-full rounded-xl border border-[#D8D9C9] bg-[#FFFFFF] px-4 py-3 text-sm leading-relaxed text-[#063B27] placeholder:text-[#87958B] focus:border-[#D9B45B] focus:ring-2 focus:ring-[#D9B45B]/35 focus:outline-none"
                      />
                    </div>

                    {error && (
                      <p
                        role="alert"
                        className="rounded-xl border border-[#D9B45B] bg-[#FFFFFF] px-3.5 py-2.5 text-xs font-semibold text-[#063B27]"
                      >
                        {error}
                      </p>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#063B27] px-6 py-3 text-sm font-semibold text-[#E6C477] transition-colors hover:bg-[#032A1D]"
                      >
                        <span>Send message</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
