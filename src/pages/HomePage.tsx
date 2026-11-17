import { HeroSection } from '../components/HeroSection';
import { NeedSection } from '../components/NeedSection';
import { VelocityRibbon } from '../components/VelocityRibbon';
import { WaitlistCtaSection } from '../components/WaitlistFooterSection';
import { useMainLayoutContext } from '../layouts/MainLayout';

export function HomePage() {
  const { onOpenWaitlist } = useMainLayoutContext();

  return (
    <>
      <HeroSection onOpenWaitlist={onOpenWaitlist} />
      <VelocityRibbon />
      <NeedSection compact />
      <WaitlistCtaSection onOpenWaitlist={onOpenWaitlist} />
    </>
  );
}

