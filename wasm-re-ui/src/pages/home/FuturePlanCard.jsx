import { cn } from '@/lib/utils';

export default function FuturePlanCard({
  className,
  description,
  icon,
  title,
}) {
  return (
    <div className={cn(
      'bg-card p-6 rounded-lg border border-border',
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm overflow-auto">
        {description}
      </p>
    </div>
  );
}
