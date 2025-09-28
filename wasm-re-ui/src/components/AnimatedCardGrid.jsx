import AnimatedCardGroup from './AnimatedCardGroup';

/**
 * 便捷组件：AnimatedCardGrid
 * 用于创建响应式的动画卡片网格
 */
export default function AnimatedCardGrid({
  children,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
  gap = '1rem',
  staggerDelay = 50,
  className = '',
  ...gridProps
}) {
  const gridStyle = {
    display: 'grid',
    gap,
    gridTemplateColumns: `repeat(${columns.sm || 1}, 1fr)`,
    '@media (minWidth: 768px)': {
      gridTemplateColumns: `repeat(${columns.md || 2}, 1fr)`,
    },
    '@media (minWidth: 1024px)': {
      gridTemplateColumns: `repeat(${columns.lg || 3}, 1fr)`,
    },
    '@media (minWidth: 1280px)': {
      gridTemplateColumns: `repeat(${columns.xl || 4}, 1fr)`,
    },
  };

  return (
    <AnimatedCardGroup
      className={`animated-card-grid ${className}`}
      staggerDelay={staggerDelay}
      style={gridStyle}
      {...gridProps}
    >
      {children}
    </AnimatedCardGroup>
  );
}
