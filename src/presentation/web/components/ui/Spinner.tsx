import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <div className="absolute inset-0 rounded-full animate-spin border-2 border-current border-t-transparent" />
    </div>
  );
}