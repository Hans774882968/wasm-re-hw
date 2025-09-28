import React, { useMemo, forwardRef } from 'react';
import { motion } from 'motion/react';
import { useCardAnimations } from '../animations/useCardAnimations';

/**
 * AnimatedCard 组件 - 带有动画效果的卡片组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子元素
 * @param {number} props.index - 卡片索引，用于延迟动画
 * @param {Object} props.animationConfig - 自定义动画配置
 * @param {string} props.className - 自定义CSS类名
 * @param {boolean} props.disabled - 是否禁用动画
 * @param {boolean} props.responsive - 是否启用响应式动画
 * @param {boolean} props.debug - 是否启用调试模式
 * @param {string} props.theme - 主题名称
 * @param {Function} props.onAnimationStart - 动画开始回调
 * @param {Function} props.onAnimationComplete - 动画完成回调
 * @param {Function} props.onAnimationError - 动画错误回调
 * @param {Function} props.onPerformanceUpdate - 性能更新回调
 * @param {Object} props.motionProps - 额外的motion组件属性
 * @param {Object} props.ref - 引用
 */
export const AnimatedCard = forwardRef(({
  children,
  index = 0,
  animationConfig = {},
  className = '',
  disabled = false,
  responsive = true,
  debug = false,
  theme = 'quantum-rose',
  onAnimationStart,
  onAnimationComplete,
  onAnimationError,
  onPerformanceUpdate,
  motionProps = {},
  ...restProps
}, ref) => {
  // 合并动画配置
  const mergedConfig = useMemo(() => ({
    index,
    responsive,
    enableEntrance: !disabled,
    enableHover: !disabled,
    enablePerformanceMonitoring: debug || !!onPerformanceUpdate,
    onAnimationStart,
    onAnimationComplete,
    onAnimationError,
    onPerformanceUpdate,
    ...animationConfig,
  }), [
    index,
    responsive,
    disabled,
    debug,
    onAnimationStart,
    onAnimationComplete,
    onAnimationError,
    onPerformanceUpdate,
    animationConfig,
  ]);

  // 使用动画Hook
  const {
    entranceProps,
    hoverProps,
    staggerProps,
    animationState,
    isVisible,
    isHovered,
    isAnimating,
    isError,
    performanceMetrics,
    isReducedMotion,
  } = useCardAnimations(mergedConfig);

  // 构建CSS类名
  const cardClasses = useMemo(() => {
    const classes = ['animated-card'];

    if (theme) {
      classes.push(theme);
    }

    if (disabled) {
      classes.push('animated-card-disabled');
    }

    if (isError) {
      classes.push('animated-card-error');
    }

    if (debug) {
      classes.push('animated-card-debug');
    }

    if (isReducedMotion) {
      classes.push('animated-card-reduced-motion');
    }

    if (performanceMetrics && !performanceMetrics.isPerformanceGood) {
      classes.push('animated-card-performance-low');
    }

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }, [
    theme,
    disabled,
    isError,
    debug,
    isReducedMotion,
    performanceMetrics,
    className,
  ]);

  // 构建数据属性
  const dataAttributes = useMemo(() => ({
    'data-animation-state': animationState.state,
    'data-animation-index': index,
    'data-animation-visible': isVisible,
    'data-animation-hovered': isHovered,
    'data-animation-animating': isAnimating,
    'data-animation-error': isError,
    'data-animation-reduced-motion': isReducedMotion,
    'data-responsive': responsive,
    'data-performance-metrics': debug && performanceMetrics
      ? JSON.stringify(performanceMetrics)
      : undefined,
    'data-animation-debug': debug
      ? `state: ${animationState.state}, index: ${index}, visible: ${isVisible}`
      : undefined,
  }), [
    animationState,
    index,
    isVisible,
    isHovered,
    isAnimating,
    isError,
    isReducedMotion,
    responsive,
    performanceMetrics,
    debug,
  ]);

  // 渲染motion组件
  return (
    <motion.div
      ref={ref}
      className={cardClasses}
      {...dataAttributes}
      {...entranceProps}
      {...hoverProps}
      {...staggerProps}
      {...motionProps}
      {...restProps}
    >
      {children}
    </motion.div>
  );
});
