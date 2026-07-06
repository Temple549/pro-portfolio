import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <PublicHeader />
      <main className="flex-1 relative z-10">{children}</main>
      <PublicFooter />
    </div>
  );
}