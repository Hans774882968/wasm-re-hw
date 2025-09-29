import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function FuturePlanCard({
  className,
  description,
  icon,
  title,
}) {
  return (
    <motion.div
      className={cn(
        'bg-card p-6 rounded-lg border border-border',
        className
      )}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm overflow-auto">
        {description}
      </p>
    </motion.div>
  );
}
