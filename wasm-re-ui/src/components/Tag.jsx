import { cn } from '@/lib/utils';

export function Tag({ children, className }) {
  return (
    <span
      className={cn(
        'px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-semibold',
        'transition-colors duration-300',
        className
      )}
    >
      {children}
    </span>
  );
}
