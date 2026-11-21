import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react';

const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || 'service_kwtfq2k';
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '';
const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || '';

const isPlaceholderValue = (val: string) =>
  !val || /^(your_|MY_)/i.test(val);

const INQUIRY_TOPICS = [
  'Parent & Family',
  'School Partnership',
  'Driver Vetting',
  'General Inquiry',
] as const;

type InquiryTopic = (typeof INQUIRY_TOPICS)[number];
type ContactErrorField = 'name' | 'email' | 'phone' | 'message' | null;
type SubmitResult =
  | {
      status: 'success';
      firstName: string;
      topic: InquiryTopic;
      email: string;
    }
  | {
      status: 'error';
    }
  | null;

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
  const [errorField, setErrorField] = useState<ContactErrorField>(null);
  const [isSending, setIsSending] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult>(null);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSending) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    const normalizedPhoneDigits =
      trimmedPhone.startsWith('+91') && phoneDigits.length === 12
        ? phoneDigits.slice(2)
        : phoneDigits;
    const trimmedMessage = message.trim();
    const emailPattern = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

    if (!trimmedName) {
      setErrorField('name');
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setErrorField('email');
      setError('Please enter your email address.');
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setErrorField('email');
      setError('Please enter a valid email address.');
      return;
    }
    if (!trimmedPhone) {
      setErrorField('phone');
      setError('Please enter your phone number.');
      return;
    }
    if (!/^[+\d\s().-]+$/.test(trimmedPhone)) {
      setErrorField('phone');
      setError('Phone number can contain only digits and phone formatting characters.');
      return;
    }
    if (normalizedPhoneDigits.length !== 10) {
      setErrorField('phone');
      setError('Phone number must contain exactly 10 digits, optionally with +91.');
      return;
    }
    if (!trimmedMessage) {
      setErrorField('message');
      setError('Please enter your message.');
      return;
    }

    setError('');
    setErrorField(null);
    setSubmitResult(null);
    setIsSending(true);

    const firstName = trimmedName.split(/\s+/)[0] || trimmedName;
    const selectedFocus = topic;

    try {
      const submitToNetlify = async () => {
        const isNetlifyHost =
          typeof window !== 'undefined' &&
          !import.meta.env.DEV &&
          !['localhost', '127.0.0.1'].includes(window.location.hostname) &&
          !window.location.hostname.endsWith('.run.app');

        if (!isNetlifyHost) {
          throw new Error(
            'EmailJS credentials are not configured in this environment and Netlify Forms is unavailable outside Netlify hosting.'
          );
        }

        const formData = new URLSearchParams({
          'form-name': 'contact-inquiry',
          'bot-field': '',
          name: trimmedName,
          email: trimmedEmail,
          phone: normalizedPhoneDigits,
          subject: selectedFocus,
          organization: organization.trim() || 'Not provided',
          message: trimmedMessage,
        });
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) {
          throw new Error(`Netlify Forms submission failed with status ${response.status}`);
        }
      };

      const emailJsConfigured =
        !isPlaceholderValue(EMAILJS_SERVICE_ID) &&
        !isPlaceholderValue(EMAILJS_TEMPLATE_ID) &&
        !isPlaceholderValue(EMAILJS_PUBLIC_KEY);

      if (emailJsConfigured) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              first_name: firstName,
              name: trimmedName,
              email: trimmedEmail,
              phone: normalizedPhoneDigits,
              subject: selectedFocus,
              organization: organization.trim() || 'Not provided',
              message: trimmedMessage,
              support_email: 'info@forgeit.co.in',
              website_url: 'https://teen-cabs.netlify.app/',
            },
            {
              publicKey: EMAILJS_PUBLIC_KEY,
            }
          );
        } catch (emailjsError) {
          console.error('EmailJS inquiry submission failed, trying Netlify Forms:', emailjsError);
          await submitToNetlify();
        }
      } else {
        console.warn(
          'EmailJS is not configured (missing VITE_EMAILJS_TEMPLATE_ID or VITE_EMAILJS_PUBLIC_KEY).'
        );
        await submitToNetlify();
      }

      setFullName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setMessage('');
      setTopic('Parent & Family');
      setSubmitResult({
        status: 'success',
        firstName,
        topic: selectedFocus,
        email: trimmedEmail,
      });
    } catch (err) {
      console.error('EmailJS inquiry submission failed:', err);
      setSubmitResult({ status: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative z-10 border-t border-[#d4af37]/12 bg-transparent py-16 sm:py-20 lg:py-24"
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
            <p className="glass-emerald mt-5 max-w-[44ch] rounded-2xl px-5 py-4 text-sm leading-[1.65] font-light text-[#D4E1D8] sm:text-[0.9375rem]">
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
                    <div className="mt-3 h-[135px] w-full overflow-hidden rounded-xl border border-[#d4af37]/25 bg-[#032A1D] shadow-inner">
                      <iframe
                        src="https://www.google.com/maps?q=12.949805,80.245964&z=15&output=embed"
                        title="Teen Cabs and Forgeit Office Map - Chennai"
                        className="h-full w-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=12.949805,80.245964"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center gap-1 py-1 font-semibold text-[#E6C477] underline-offset-4 hover:text-[#D9B45B] hover:underline"
                      >
                        <span>Get Directions</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <span className="font-mono text-[10px] text-[#B7C8BA]">
                        12°56&apos;59.3&quot;N 80°14&apos;45.5&quot;E
                      </span>
                    </div>
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
          <div data-contact-right className="-mx-6 lg:col-span-7 lg:mx-0">
            <div className="contact-sheet-form border-y border-[#D8D9C9] bg-[#F3F0E6] px-6 py-6 text-[#063B27] shadow-2xl shadow-black/45 sm:mx-0 sm:rounded-3xl sm:border sm:p-8 lg:p-10">
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

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 space-y-5"
              >
                {/* Topic Selector Buttons */}
                <fieldset disabled={isSending}>
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
                          disabled={isSending}
                          className={`min-h-[44px] cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[38px] sm:py-1.5 ${
                            active
                              ? 'border border-[#0B1F16] bg-[#0B1F16] text-[#D4B46A] shadow-sm'
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
                          disabled={isSending}
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errorField === 'name') {
                              setError('');
                              setErrorField(null);
                            }
                          }}
                          aria-invalid={errorField === 'name'}
                          aria-describedby={errorField === 'name' ? 'contact-name-error' : undefined}
                          placeholder="Enter your full name"
                          className={`min-h-[46px] w-full rounded-xl border bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:ring-2 focus:outline-none ${
                            errorField === 'name'
                              ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/25'
                              : 'border-[#D8D9C9] focus:border-[#D9B45B] focus:ring-[#D9B45B]/35'
                          }`}
                        />
                        {errorField === 'name' && (
                          <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-[#C0392B]">
                            {error}
                          </p>
                        )}
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
                          required
                          autoComplete="email"
                          disabled={isSending}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorField === 'email') {
                              setError('');
                              setErrorField(null);
                            }
                          }}
                          aria-invalid={errorField === 'email'}
                          aria-describedby={errorField === 'email' ? 'contact-email-error' : undefined}
                          placeholder="you@example.com"
                          className={`min-h-[46px] w-full rounded-xl border bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:ring-2 focus:outline-none ${
                            errorField === 'email'
                              ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/25'
                              : 'border-[#D8D9C9] focus:border-[#D9B45B] focus:ring-[#D9B45B]/35'
                          }`}
                        />
                        {errorField === 'email' && (
                          <p id="contact-email-error" role="alert" className="mt-1.5 text-xs font-medium text-[#C0392B]">
                            {error}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1.5 block text-xs font-semibold text-[#063B27]"
                        >
                          Phone / WhatsApp <span className="text-[#547064]">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          maxLength={20}
                          inputMode="tel"
                          autoComplete="tel"
                          disabled={isSending}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errorField === 'phone') {
                              setError('');
                              setErrorField(null);
                            }
                          }}
                          aria-invalid={errorField === 'phone'}
                          aria-describedby={errorField === 'phone' ? 'contact-phone-error' : undefined}
                          placeholder="Enter 10-digit phone number"
                          className={`min-h-[46px] w-full rounded-xl border bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#063B27] placeholder:text-[#87958B] focus:ring-2 focus:outline-none ${
                            errorField === 'phone'
                              ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/25'
                              : 'border-[#D8D9C9] focus:border-[#D9B45B] focus:ring-[#D9B45B]/35'
                          }`}
                        />
                        {errorField === 'phone' && (
                          <p id="contact-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-[#C0392B]">
                            {error}
                          </p>
                        )}
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
                          disabled={isSending}
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
                        disabled={isSending}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errorField === 'message') {
                            setError('');
                            setErrorField(null);
                          }
                        }}
                        aria-invalid={errorField === 'message'}
                        aria-describedby={errorField === 'message' ? 'contact-message-error' : undefined}
                        placeholder="Share your questions, school commute needs, or partnership details..."
                        className={`w-full rounded-xl border bg-[#FFFFFF] px-4 py-3 text-sm leading-relaxed text-[#063B27] placeholder:text-[#87958B] focus:ring-2 focus:outline-none ${
                          errorField === 'message'
                            ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/25'
                            : 'border-[#D8D9C9] focus:border-[#D9B45B] focus:ring-[#D9B45B]/35'
                        }`}
                      />
                      {errorField === 'message' && (
                        <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-medium text-[#C0392B]">
                          {error}
                        </p>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {submitResult?.status === 'success' && (
                        <motion.div
                          key="submit-success"
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                          role="status"
                          className="flex items-start justify-between gap-3 rounded-2xl border border-[#0B1F16] bg-[#0B1F16] px-4 py-3.5 text-[#F3F0E6] shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle2
                              className="mt-0.5 h-5 w-5 shrink-0 text-[#D4B46A]"
                              aria-hidden="true"
                            />
                            <div className="text-xs leading-relaxed sm:text-sm">
                              <p className="font-semibold text-[#F3F0E6]">
                                Thank you, {submitResult.firstName}. Your inquiry is on its way.
                              </p>
                              <p className="mt-0.5 text-[#D4E1D8]">
                                Your inquiry for{' '}
                                <span className="font-semibold text-[#D4B46A]">
                                  {submitResult.topic}
                                </span>{' '}
                                was submitted successfully. We will respond at{' '}
                                <span className="font-mono text-[#F3F0E6]">
                                  {submitResult.email}
                                </span>
                                .
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSubmitResult(null)}
                            aria-label="Dismiss confirmation message"
                            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#D4E1D8] transition-colors hover:bg-[#143728] hover:text-[#F3F0E6]"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </motion.div>
                      )}

                      {submitResult?.status === 'error' && (
                        <motion.div
                          key="submit-error"
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                          role="alert"
                          className="flex items-start justify-between gap-3 rounded-2xl border border-[#C0392B]/35 bg-[#FDF2F2] px-4 py-3.5 text-[#7F1D1D]"
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle
                              className="mt-0.5 h-5 w-5 shrink-0 text-[#C0392B]"
                              aria-hidden="true"
                            />
                            <p className="text-xs leading-relaxed sm:text-sm">
                              Unable to send your inquiry right now. Please contact us directly at{' '}
                              <a
                                href="mailto:info@forgeit.co.in"
                                className="font-semibold underline decoration-[#C0392B]/60 underline-offset-2 hover:text-[#5C1313]"
                              >
                                info@forgeit.co.in
                              </a>
                              .
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSubmitResult(null)}
                            aria-label="Dismiss error message"
                            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#7F1D1D]/80 transition-colors hover:bg-[#C0392B]/10 hover:text-[#7F1D1D]"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSending}
                        className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#063B27] px-6 py-3 text-sm font-semibold text-[#E6C477] transition-colors hover:bg-[#032A1D] disabled:cursor-not-allowed disabled:opacity-75"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send message</span>
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
