import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { LucideIcon } from 'lucide-react';

// 1. ADD 'outline' TO THE TYPE DEFINITION
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'hover:bg-muted/50': variant === 'ghost',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            
            // 2. ADD THE STYLING FOR THE OUTLINE VARIANT
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            
            // Sizes
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Spinner size={size === 'sm' ? 'sm' : 'md'} />
            {children && <span className="ml-2">{children}</span>}
          </span>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-4 h-4 mr-2" />}
            {children}
            {RightIcon && <RightIcon className="w-4 h-4 ml-2" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };