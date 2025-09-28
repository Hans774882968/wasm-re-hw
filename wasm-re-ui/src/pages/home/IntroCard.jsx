import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Tag } from '@/components/Tag';
import { difficultyColors } from '@/common/consts';
import { AnimatedCard } from '@/components/AnimatedCard';

export function IntroCard({
  className,
  description,
  icon,
  problemTags,
  tags,
  title,
  to,
}) {
  return (
    <AnimatedCard
      className={cn(
        'bg-card rounded-xl shadow-lg border border-border overflow-hidden',
        className
      )}
      theme="quantum-rose"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <p className="text-muted-foreground mb-6">{description}</p>

        {Array.isArray(tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {
              tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))
            }
          </div>
        )}

        {Array.isArray(problemTags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {problemTags.map((tag, index) => (
              <Tag
                key={index}
                className={difficultyColors[tag]}
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}

        <Link
          to={to}
          className={cn(
            'group inline-flex items-center justify-center gap-2 w-full',
            'bg-primary text-primary-foreground py-2 px-4 rounded-md',
            'transition-colors duration-300 hover:bg-primary/90'
          )}
        >
          查看
          <FaArrowRight className="text-xs group-hover:scale-x-150 group-hover:translate-x-0.75 transition-transform duration-600" />
        </Link>
      </div>
    </AnimatedCard>
  );
}
