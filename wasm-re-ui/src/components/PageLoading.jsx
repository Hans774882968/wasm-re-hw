import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * 加载指示器
 * @param {Object} props
 * @param {string} [props.className] - 额外类名
 * @param {string} [props.size='lg'] - 尺寸：'sm' | 'md' | 'lg'
 * @param {string} [props.ariaLabel='加载中'] - ARIA 标签
 */
function LoadingSpinner({
  className,
  size = 'lg',
  ariaLabel = '加载中',
  ...props
}) {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  if (!iconSizeClasses[size]) {
    console.warn(`LoadingSpinner: 无效的 size "${size}"，使用默认 "lg"`);
    size = 'lg';
  }

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center',
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          'animate-spin',
          iconSizeClasses[size],
          'text-primary',
          'aria-hidden'
        )}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * 页面级加载状态组件
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.size='lg'] - 尺寸：'sm' | 'md' | 'lg'
 */
export default function PageLoading({
  className,
  size = 'lg',
  ...props
}) {
  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'min-h-50 p-6',
        'text-primary',
        textSizeClasses[size],
        className
      )}
      {...props}
    >
      <LoadingSpinner size={size} ariaLabel="加载中…" />
      <p className="mt-3 font-bold">加载中…</p>
    </div>
  );
}
