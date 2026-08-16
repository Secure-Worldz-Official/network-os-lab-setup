import { HeroSection } from '@/components/home/HeroSection';
import { OverallProgress } from '@/components/home/OverallProgress';
import { ModulePreview } from '@/components/home/ModulePreview';
import { useProgress } from '@/hooks/useProgress';

export function HomePage() {
  const progress = useProgress();

  return (
    <>
      <HeroSection />
      <OverallProgress progress={progress} />
      <ModulePreview progress={progress} />
    </>
  );
}
