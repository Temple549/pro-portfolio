interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
  const delayClass = delay > 0 ? `delay-${delay}` : '';
  
  return (
    <div className={`animate-fade-in-up ${delayClass} ${className}`}>
      {children}
    </div>
  );
}