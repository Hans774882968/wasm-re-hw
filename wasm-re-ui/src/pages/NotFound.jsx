import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        className={cn(
          'max-w-2xl w-full bg-card rounded-2xl shadow-lg p-8 text-center border border-border',
          'transition-shadow duration-200 hover:shadow-xl'
        )}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">页面未找到</h1>
        <p className="text-muted-foreground mb-8">
          你来到了没有知识的荒原qwq
        </p>

        <Button asChild className="w-full">
          <Link to="/" className="flex items-center justify-center gap-2">
            <Home className="h-4 w-4" />
            回到首页
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
