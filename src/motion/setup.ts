import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

let isMotionConfigured = false;

// Safeguard against GSAP InertiaPlugin issue where data.styles.revert is called on non-DOM or detached targets
if (InertiaPlugin && typeof (InertiaPlugin as any).render === 'function') {
  const origRender = (InertiaPlugin as any).render;
  (InertiaPlugin as any).render = function (ratio: any, data: any) {
    if (data && (!data.styles || typeof data.styles.revert !== 'function')) {
      data.styles = { revert: () => {}, save: () => {} };
    }
    return origRender.call(this, ratio, data);
  };
}

export function configureMotion(): void {
  if (isMotionConfigured) return;

  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    SplitText,
    Flip,
    DrawSVGPlugin,
    Observer,
    InertiaPlugin
  );
  gsap.defaults({ overwrite: 'auto', force3D: true });
  ScrollTrigger.config({ ignoreMobileResize: true });

  isMotionConfigured = true;
}

configureMotion();

export {
  gsap,
  useGSAP,
  DrawSVGPlugin,
  Flip,
  InertiaPlugin,
  Observer,
  ScrollTrigger,
  SplitText,
};
