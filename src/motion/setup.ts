import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let isMotionConfigured = false;

export function configureMotion(): void {
  if (isMotionConfigured) return;

  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ overwrite: 'auto', force3D: true });
  ScrollTrigger.config({ ignoreMobileResize: true });

  isMotionConfigured = true;
}

configureMotion();

export { gsap, ScrollTrigger, useGSAP };
