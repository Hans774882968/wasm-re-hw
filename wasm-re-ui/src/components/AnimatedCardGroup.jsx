import React from 'react';
import { AnimatedCard } from './AnimatedCard';

/**
 * 便捷组件：AnimatedCardGroup
 * 用于管理一组AnimatedCard的延迟动画
 */
export default function AnimatedCardGroup({
  children,
  staggerDelay = 50,
  className = '',
  ...groupProps
}) {
  // 验证子元素
  const validChildren = React.Children.toArray(children).filter(child =>
    React.isValidElement(child)
  );

  return (
    <div className={`animated-card-group ${className}`} {...groupProps}>
      {validChildren.map((child, index) => {
        if (child.type === AnimatedCard) {
          // 如果子元素已经是AnimatedCard，添加索引
          return React.cloneElement(child, {
            index,
            staggerDelay,
          });
        } else {
          // 否则包装成AnimatedCard
          return (
            <AnimatedCard
              key={child.key || index}
              index={index}
              staggerDelay={staggerDelay}
            >
              {child}
            </AnimatedCard>
          );
        }
      })}
    </div>
  );
}
