export const MOTION_DURATION = {
  micro: 0.24,
  fast: 0.36,
  reveal: 0.85,
  route: 0.55,
  cinematic: 1.1,
} as const;

export const MOTION_EASE = {
  editorial: 'expo.out',
  gentle: 'power3.out',
  smoothInOut: 'power2.inOut',
  scroll: 'none',
  motionEditorial: [0.22, 1, 0.36, 1] as const,
} as const;

export const MOTION_STAGGER = {
  text: 0.09,
  line: 0.09,
  card: 0.08,
  milestone: 0.1,
} as const;

export const MOTION_DISTANCE = {
  desktopX: 36,
  mobileX: 16,
  desktopY: 28,
  mobileY: 16,
  depthY: 24,
} as const;

export const MOTION_SCALE = {
  foregroundFrom: 0.96,
  foregroundTo: 1,
  microHover: 1.02,
  pinEnter: 0.84,
} as const;

export const MOTION_PARALLAX = {
  subtle: 14,
  heroStage: 18,
  background: 28,
  foreground: 36,
  scrubSmooth: 0.35,
} as const;

export const MOTION_TOKENS = {
  duration: MOTION_DURATION,
  ease: MOTION_EASE,
  stagger: MOTION_STAGGER,
  distance: MOTION_DISTANCE,
  scale: MOTION_SCALE,
  parallax: MOTION_PARALLAX,
} as const;

export type MotionTokens = typeof MOTION_TOKENS;
export type MotionDurationKey = keyof typeof MOTION_DURATION;
export type MotionEaseKey = keyof typeof MOTION_EASE;
export type MotionStaggerKey = keyof typeof MOTION_STAGGER;
export type MotionDistanceKey = keyof typeof MOTION_DISTANCE;
export type MotionScaleKey = keyof typeof MOTION_SCALE;
export type MotionParallaxKey = keyof typeof MOTION_PARALLAX;
