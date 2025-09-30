import { toast } from 'sonner';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FaExclamationCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { RefreshCcw, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * 用于包裹路由组件的错误边界，捕获代码分割失败等错误
 * @param {Object} props
 * @param {Error} props.error
 * @param {Function} props.resetErrorBoundary
 */
export default function RouteErrorBoundary({
  error,
  resetErrorBoundary,
}) {
  // 判断是否为动态导入失败（常见于 chunk 加载失败）
  const isChunkLoadError =
    error?.name === 'ChunkLoadError' ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('Failed to fetch dynamically imported module');

  const errorMessage = isChunkLoadError
    ? '页面资源加载失败，请检查网络后重试qwq'
    : '页面加载出错，请稍后重试qwq';

  useEffect(() => {
    toast.error(errorMessage, {
      action: {
        label: '刷新',
        onClick: () => window.location.reload(),
      },
    });
  }, [errorMessage]);

  // 亲测无论是否有网，重试都 100% 失败，但还是留着
  const handleRetry = () => {
    resetErrorBoundary();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <motion.div
      className={cn(
        'flex min-h-100 flex-col items-center justify-center',
        'p-6 text-center',
        'bg-background text-foreground'
      )}
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className={cn(
          'mb-6 flex items-center justify-center'
        )}
      >
        <FaExclamationCircle className="text-primary w-16 h-16" />
      </div>

      <h2 className="mb-2 text-2xl font-bold">页面加载失败</h2>
      <p className="mb-6 max-w-md text-muted-foreground">{errorMessage}</p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={handleRetry}
        >
          <RefreshCw className="w-4 h-4" />
          重试
        </Button>
        <Button
          onClick={handleReload}
        >
          <RefreshCcw className="w-4 h-4" /> 刷新
        </Button>
      </div>
    </motion.div>
  );
}
