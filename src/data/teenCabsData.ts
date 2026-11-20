import karthikPortrait from '../assets/team/karthik-s.jpeg';
import manishPortrait from '../assets/team/manish-t.jpeg';
import manobalaPortrait from '../assets/team/manobala-c.jpeg';
import sriramPortrait from '../assets/team/sriram-v.jpeg';
import tharunPortrait from '../assets/team/tharun-v.jpeg';
import kaavyaPortrait from '../../assets/Kaavya.jpeg';
import sudarshanPortrait from '../../assets/Sudarshan.jpeg';
import vedaanthPortrait from '../../assets/Vedaanth.jpeg';
import tejasreePortrait from '../../assets/tejasree.jpeg';

export interface NeedItem {
  id: string;
  title: string;
  description: string;
}

export interface StatMetric {
  value: string;
  label: string;
  ariaLabel: string;
  description?: string;
}

export interface ApproachItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
}

export interface SafetyProtocol {
  id: 'verified' | 'sos' | 'gps';
  label: string;
  heading: string;
  summary: string;
  checkpoints: string[];
}

export interface RideVibePreset {
  id: 'lofi' | 'study' | 'quiet';
  label: string;
  trackTitle: string;
  cabinSetting: string;
  bars: number[];
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  group: 'founder' | 'leadership' | 'core' | 'product';
  portraitSrc?: string;
  summaryLine: string;
  bio: string;
  responsibilities: string[];
  focusArea: string;
  quote: string;
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Features', to: '/features' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
] as const;

export const NEED_ITEMS: NeedItem[] = [
  {
    id: 'dedicated',
    title: 'No dedicated cab system',
    description:
      'Existing ride-hailing apps are built for adults. Teens are left using platforms never designed for their safety or daily school commutes.',
  },
  {
    id: 'safety',
    title: 'Critical safety concerns',
    description:
      'Parents have little visibility into a teen’s ride, with no dedicated real-time route verification, emergency alerts, or teen-vetted driver profiles.',
  },
  {
    id: 'supervision',
    title: 'Zero parental supervision',
    description:
      'Once a teen books a standard ride, parents are left in the dark — without approval controls, spending guardrails, or peace of mind.',
  },
];

export const BIGGER_PICTURE_STATS: StatMetric[] = [
  {
    value: 'FIRST',
    label: 'Teen-Dedicated Platform',
    ariaLabel: 'First teen-dedicated platform purpose-built for teens and families',
    description:
      'Purpose-built from the ground up for daily teen commutes and parental peace of mind.',
  },
  {
    value: '2x',
    label: 'Higher risk vs adults',
    ariaLabel: 'Two times higher safety risk compared to adult riders',
  },
  {
    value: '1B+',
    label: 'Teen rides needed yearly',
    ariaLabel: 'Over one billion teen rides needed every year',
  },
  {
    value: '9/10',
    label: 'Parents want supervision',
    ariaLabel: 'Nine out of ten parents want active ride supervision',
  },
];

export const APPROACH_ITEMS: ApproachItem[] = [
  {
    id: 'parent-linked',
    stepNumber: '01',
    title: 'Built around families',
    subtitle: 'Parent-linked system',
    description:
      'Every teen account is connected to a verified parent account. Parents approve rides, set restrictions, and stay in full control.',
    detail: 'Instant two-way sync between guardian and teen devices.',
  },
  {
    id: 'monitored',
    stepNumber: '02',
    title: 'Safety at every step',
    subtitle: 'Safe & fully monitored',
    description:
      'Real-time GPS tracking, background-verified drivers, one-tap SOS alerts, and automatic ride summaries sent after every trip.',
    detail: 'Continuous route adherence checks from pickup to drop-off.',
  },
  {
    id: 'gen-z',
    stepNumber: '03',
    title: 'Designed for a new generation',
    subtitle: 'Built for Gen Z',
    description:
      'A fast, intuitive interface teens actually want to use. Quick booking, audio preferences, and calm visual clarity without friction.',
    detail: 'Designed with teen commuters for everyday independence.',
  },
];

export const SAFETY_PROTOCOLS: SafetyProtocol[] = [
  {
    id: 'verified',
    label: 'Verified drivers',
    heading: 'Multi-stage driver vetting',
    summary:
      'Every driver completes identity verification, multi-year background screening, and in-person safety onboarding before accepting teen trips.',
    checkpoints: [
      'Government ID & license verified',
      'Annual criminal & driving record check',
      'Live pre-pickup selfie match',
    ],
  },
  {
    id: 'sos',
    label: 'SOS support',
    heading: 'One-tap emergency response',
    summary:
      'Both teen and parent can trigger immediate escalation with live cabin audio check-in and automatic location dispatch.',
    checkpoints: [
      'Round-the-clock dedicated safety desk',
      'Simultaneous guardian emergency alert',
      'Instant route lock & live dispatch',
    ],
  },
  {
    id: 'gps',
    label: 'Live GPS',
    heading: 'Continuous corridor tracking',
    summary:
      'Smart route monitoring detects unexpected stops or detours and notifies connected parents automatically.',
    checkpoints: [
      'Sub-5-second live GPS telemetry refresh',
      'Automatic detour & stop anomaly alerts',
      'Verified drop-off confirmation notice',
    ],
  },
];

export const VIBE_PRESETS: RideVibePreset[] = [
  {
    id: 'lofi',
    label: 'Music modes',
    trackTitle: 'Late Afternoon Lo-Fi',
    cabinSetting: 'Balanced cabin volume with warm ambient EQ',
    bars: [38, 64, 52, 84, 70, 46, 78, 58, 42, 68],
  },
  {
    id: 'study',
    label: 'Custom profiles',
    trackTitle: 'Exam Prep Focus',
    cabinSetting: 'Low conversation mode with gentle climate preset',
    bars: [24, 42, 36, 54, 48, 32, 46, 38, 28, 40],
  },
  {
    id: 'quiet',
    label: 'Personalisation',
    trackTitle: 'Quiet Ride Mode',
    cabinSetting: 'Zero cabin music with direct route notifications only',
    bars: [12, 16, 14, 18, 14, 12, 16, 14, 12, 14],
  },
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'register',
    title: 'Parent registers',
    description:
      'Parent creates a family account with quick identity verification and shared payment setup.',
  },
  {
    id: 'link',
    title: 'Teen profile linked',
    description:
      'Parent invites their teen and configures ride permissions, safe zones, and weekly spending limits.',
  },
  {
    id: 'request',
    title: 'Teen requests ride',
    description:
      'Teen books a ride through the app. Parent gets notified immediately and approves in one tap.',
  },
  {
    id: 'track',
    title: 'Safe tracked ride',
    description:
      'A verified driver picks up the teen. Live GPS tracking continues until arrival with an instant summary.',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'manish',
    initials: 'MT',
    name: 'Manish T',
    role: 'Founder & CEO',
    group: 'founder',
    portraitSrc: manishPortrait,
    summaryLine: 'Shapes company vision, trust & strategy.',
    bio: 'Leads Forgeit and Teen Cabs with a focus on practical, trustworthy mobility technology built for families. Shapes company vision, school and city partnerships, and product decisions around calm parent confidence and everyday teen independence.',
    responsibilities: [
      'Company vision & family-first safety strategy',
      'School, parent community & city partnerships',
      'Long-term product & operational direction',
    ],
    focusArea: 'Overall Strategy & Mobility Vision',
    quote:
      'Every parent deserves calm visibility, and every teen deserves a ride built around their world.',
  },
  {
    id: 'sriram',
    initials: 'SV',
    name: 'Sriram V',
    role: 'Chief Innovation Officer',
    group: 'leadership',
    portraitSrc: sriramPortrait,
    summaryLine: 'Drives future mobility & pilot programs.',
    bio: 'Identifies emerging urban mobility opportunities and translates long-term ideas into practical product direction for Teen Cabs. Connects evolving family safety expectations, business priorities, and new transport technologies into cohesive rider workflows.',
    responsibilities: [
      'Emerging mobility pilots & strategic foresight',
      'Translating family safety needs into new capabilities',
      'Cross-functional innovation & roadmap alignment',
    ],
    focusArea: 'Future Mobility & Strategic Foresight',
    quote:
      'True independence for teens begins when safety is engineered into the foundation, not bolted on later.',
  },
  {
    id: 'karthik',
    initials: 'S',
    name: 'Karthik S',
    role: 'Chief Marketing Officer',
    group: 'leadership',
    portraitSrc: karthikPortrait,
    summaryLine: 'Builds brand growth & community trust.',
    bio: 'Builds the Teen Cabs brand through thoughtful outreach campaigns, school community engagement, and transparent communication. Focuses on earning lasting multi-generational trust across safety-conscious parents, independent teens, schools, and local mobility partners.',
    responsibilities: [
      'Brand positioning & multi-generational storytelling',
      'Parent & school outreach programs',
      'Launch campaigns & local community trust building',
    ],
    focusArea: 'Brand Growth & Community Trust',
    quote:
      'We listen closely to both parents and teens so our platform earns trust across two generations.',
  },
  {
    id: 'tharun',
    initials: 'TV',
    name: 'Tharun V',
    role: 'Chief Technology Officer',
    group: 'core',
    portraitSrc: tharunPortrait,
    summaryLine: 'Leads platform architecture & telemetry.',
    bio: 'Leads platform engineering, system reliability, and real-time ride infrastructure across Forgeit and Teen Cabs. Designs secure live GPS telemetry, guardian alert pipelines, and resilient dispatch services that families depend on every day.',
    responsibilities: [
      'Real-time GPS telemetry & route verification systems',
      'Scalable cloud architecture & dispatch reliability',
      'Data security, privacy & guardian alert pipelines',
    ],
    focusArea: 'Scalable Architecture & Telemetry',
    quote:
      'Behind every calm parent notification is rock-solid real-time engineering.',
  },
  {
    id: 'manobala',
    initials: 'MC',
    name: 'Manobala C',
    role: 'Chief Designing Officer',
    group: 'core',
    portraitSrc: manobalaPortrait,
    summaryLine: 'Directs visual systems & product craft.',
    bio: 'Directs product design and visual systems across both the teen rider and parent companion experiences. Combines high-contrast readability, calm visual hierarchy, and purposeful interactions so families can verify trip status in a single glance.',
    responsibilities: [
      'End-to-end design systems & visual identity',
      'Parent approval & teen booking interaction craft',
      'Accessibility, readability & calm UI clarity',
    ],
    focusArea: 'Visual Systems & Product Craft',
    quote:
      'Clarity is a safety feature — teens and parents should understand every ride state in a single glance.',
  },
  {
    id: 'kaavya',
    initials: 'K',
    name: 'Kaviya',
    role: 'Product Team',
    group: 'product',
    portraitSrc: kaavyaPortrait,
    summaryLine: 'Leads user research & rider experience.',
    bio: 'Supports product discovery, family research, and usability refinement across core Teen Cabs workflows. Maps daily commute friction from parents and teens alike, turning qualitative insights into clear, practical product improvements.',
    responsibilities: [
      'Parent & teen user discovery research',
      'Usability testing & commute workflow refinement',
      'Translating family feedback into feature specs',
    ],
    focusArea: 'Product Development & User Experience',
    quote: 'Every thoughtful detail should make the journey feel simpler.',
  },
  {
    id: 'vedaanth',
    initials: 'V',
    name: 'Vedanth',
    role: 'Product Team',
    group: 'product',
    portraitSrc: vedaanthPortrait,
    summaryLine: 'Prototypes booking & safety flows.',
    bio: 'Contributes to product development and rapid feature experimentation across booking and in-ride safety flows. Explores practical ways to present driver verification, live trip updates, and cabin preferences clearly for young riders.',
    responsibilities: [
      'Feature prototyping & rider flow experiments',
      'Driver verification & in-ride safety UX',
      'Cross-team iteration from concept to launch',
    ],
    focusArea: 'Development & Product Innovation',
    quote: 'Innovation matters most when it improves everyday confidence.',
  },
  {
    id: 'sudarshan',
    initials: 'S',
    name: 'Sudarshan',
    role: 'Product Team',
    group: 'product',
    portraitSrc: sudarshanPortrait,
    summaryLine: 'Delivers core features & quality testing.',
    bio: 'Works across core product execution, quality validation, and cross-device delivery for Teen Cabs. Translates product specifications into dependable user journeys while auditing edge cases across pickup, approval, and drop-off states.',
    responsibilities: [
      'Core booking & supervision feature delivery',
      'Cross-device testing & edge-case validation',
      'Release readiness & interaction polish',
    ],
    focusArea: 'Core Product Features',
    quote: 'The best features make safe journeys feel effortless.',
  },
  {
    id: 'tejasree',
    initials: 'TM',
    name: 'Tejashree',
    role: 'Product Team',
    group: 'product',
    portraitSrc: tejasreePortrait,
    summaryLine: 'Shapes end-to-end rider journeys.',
    bio: 'Shapes the end-to-end product experience across journey planning, interface flow, and feature refinement. Turns family feedback into approachable booking and supervision touchpoints that feel calm, clear, and intuitive to use daily.',
    responsibilities: [
      'End-to-end journey mapping & interaction flow',
      'Feature refinement for parent & teen clarity',
      'Product-design collaboration on core experiences',
    ],
    focusArea: 'Product Experience & Feature Craft',
    quote:
      'Thoughtful design creates effortless journeys for both parents and teens.',
  },
];
