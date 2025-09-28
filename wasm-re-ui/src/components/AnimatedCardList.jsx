import { AnimatedCard } from './AnimatedCard';

/**
 * 便捷组件：AnimatedCardList
 * 用于渲染数据列表为AnimatedCard
 */
export default function AnimatedCardList({
  items = [],
  renderItem,
  staggerDelay = 50,
  cardProps = {},
  listProps = {},
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  if (typeof renderItem !== 'function') {
    console.error('AnimatedCardList: renderItem 必须是函数');
    return null;
  }

  return (
    <div {...listProps}>
      {items.map((item, index) => (
        <AnimatedCard
          key={item.key || item.id || index}
          index={index}
          staggerDelay={staggerDelay}
          {...cardProps}
        >
          {renderItem(item, index)}
        </AnimatedCard>
      ))}
    </div>
  );
}
