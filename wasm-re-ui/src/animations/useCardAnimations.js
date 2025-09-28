import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  createEntranceAnimation,
  createHoverAnimation,
  createStaggerAnimation,
  getAnimationState,
  performanceMonitor,
  responsiveAnimationConfig,
  AnimationState,
  defaultAnimationConfig,
  formatAnimationError,
  debounce,
  getDeviceAnimationConfig,
} from './animationUtils.js';

/**
 * 卡片动画Hook
 * @param {Object} options - 动画选项
 * @returns {Object} 动画属性和状态
 */
export const useCardAnimations = (options = {}) => {
  const {
    entranceDuration = 300,
    hoverDuration = 200,
    hoverDistance = 4,
    staggerDelay = 50,
    index = 0,
    enableEntrance = true,
    enableHover = true,
    enablePerformanceMonitoring = false,
    performanceThreshold = 60,
    responsive = true,
    onAnimationStart,
    onAnimationComplete,
    onAnimationError,
    onPerformanceUpdate,
  } = options;

  // 动画状态管理
  const [animationState, setAnimationState] = useState(AnimationState.IDLE);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 性能监控器
  const monitor = useMemo(() =>
    enablePerformanceMonitoring
      ? performanceMonitor({ threshold: performanceThreshold })
      : null,
  [enablePerformanceMonitoring, performanceThreshold]
  );

  // 响应式配置
  useEffect(() => {
    if (!responsive) return;

    const { isReducedMotion: reduced } = responsiveAnimationConfig();
    setIsReducedMotion(reduced);

    // 监听 prefers-reduced-motion 变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [responsive]);

  // 设备适配配置
  const deviceConfig = useMemo(() => {
    return getDeviceAnimationConfig(
      {
        entranceDuration,
        hoverDuration,
        hoverDistance,
      },
      {
        // 移动端配置
        entranceDuration: Math.min(entranceDuration, 200),
        hoverDuration: Math.min(hoverDuration, 150),
        hoverDistance: Math.min(hoverDistance, 2),
      }
    );
  }, [entranceDuration, hoverDuration, hoverDistance]);

  // 入场动画配置
  const entranceProps = useMemo(() => {
    if (isReducedMotion || !enableEntrance) {
      return {};
    }

    const config = createEntranceAnimation(
      deviceConfig.entranceDuration,
      'ease',
      0
    );

    // 添加动画事件监听
    return {
      ...config,
      onAnimationStart: () => {
        setAnimationState(AnimationState.ENTERING);
        setIsVisible(true);
        if (monitor) monitor.start();
        if (onAnimationStart) onAnimationStart('entrance');
      },
      onAnimationComplete: () => {
        setAnimationState(AnimationState.ENTERED);
        if (monitor) {
          monitor.end('entrance');
          const metrics = monitor.getMetrics();
          setPerformanceMetrics(metrics);
          if (onPerformanceUpdate) onPerformanceUpdate(metrics);
        }
        if (onAnimationComplete) onAnimationComplete('entrance');
      },
    };
  }, [
    isReducedMotion,
    enableEntrance,
    deviceConfig.entranceDuration,
    monitor,
    onAnimationStart,
    onAnimationComplete,
    onPerformanceUpdate,
  ]);

  // 悬停动画配置
  const hoverProps = useMemo(() => {
    if (isReducedMotion || !enableHover) {
      return {};
    }

    const config = createHoverAnimation(
      deviceConfig.hoverDuration,
      'ease',
      -Math.abs(deviceConfig.hoverDistance)
    );

    return {
      ...config,
      onHoverStart: () => {
        setIsHovered(true);
        if (onAnimationStart) onAnimationStart('hover');
      },
      onHoverEnd: () => {
        setIsHovered(false);
        if (onAnimationComplete) onAnimationComplete('hover');
      },
    };
  }, [
    isReducedMotion,
    enableHover,
    deviceConfig.hoverDuration,
    deviceConfig.hoverDistance,
    onAnimationStart,
    onAnimationComplete,
  ]);

  // 延迟动画配置
  const staggerProps = useMemo(() => {
    if (isReducedMotion) {
      return {};
    }

    return createStaggerAnimation(staggerDelay, index);
  }, [isReducedMotion, staggerDelay, index]);

  // 错误处理
  const handleError = useCallback((error, context = {}) => {
    const formattedError = formatAnimationError(
      error,
      'useCardAnimations',
      context.animationType || 'unknown'
    );
    
    setAnimationState(AnimationState.ERROR);
    
    if (onAnimationError) {
      onAnimationError(formattedError);
    } else {
      console.error('动画错误:', formattedError);
    }
  }, [onAnimationError]);

  // 性能监控防抖更新
  const debouncedPerformanceUpdate = useMemo(
    () => debounce((metrics) => {
      if (onPerformanceUpdate) {
        onPerformanceUpdate(metrics);
      }
    }, 100),
    [onPerformanceUpdate]
  );

  // 初始化动画
  useEffect(() => {
    if (!enableEntrance || isReducedMotion) {
      setAnimationState(AnimationState.ENTERED);
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      try {
        setAnimationState(AnimationState.ENTERING);
        setIsVisible(true);
        if (monitor) monitor.start();
        if (onAnimationStart) onAnimationStart('entrance');
      } catch (error) {
        handleError(error, { animationType: 'entrance' });
      }
    }, (index * staggerDelay) / 2); // 稍微减少延迟以改善感知性能

    return () => clearTimeout(timer);
  }, [enableEntrance, isReducedMotion, index, staggerDelay, monitor, onAnimationStart, handleError]);

  // 获取当前动画状态
  const currentState = useMemo(() => {
    return getAnimationState(animationState, isHovered, index, {
      entranceDuration: deviceConfig.entranceDuration,
      hoverDuration: deviceConfig.hoverDuration,
      hoverDistance: deviceConfig.hoverDistance,
      staggerDelay,
      isReducedMotion,
      performanceMetrics: enablePerformanceMonitoring ? performanceMetrics : {},
      performanceThreshold,
    });
  }, [
    animationState,
    isHovered,
    index,
    deviceConfig,
    staggerDelay,
    isReducedMotion,
    performanceMetrics,
    performanceThreshold,
    enablePerformanceMonitoring,
  ]);

  // 返回动画配置和状态
  return {
    entranceProps,
    hoverProps,
    staggerProps,
    animationState: currentState,
    // 便捷方法
    isVisible: currentState.isVisible,
    isHovered: currentState.isHovered,
    isAnimating: animationState === AnimationState.ENTERING,
    isError: animationState === AnimationState.ERROR,
    performanceMetrics: enablePerformanceMonitoring ? performanceMetrics : null,
    isReducedMotion,
  };
};

/**
 * 批量卡片动画Hook
 * @param {Array} cards - 卡片数据数组
 * @param {Object} options - 动画选项
 * @returns {Object} 批量动画配置
 */
export const useCardAnimationsBatch = (cards = [], options = {}) => {
  const {
    staggerDelay = 50,
    maxConcurrent = 10,
    ...restOptions
  } = options;

  // 分批处理以避免性能问题
  const batches = useMemo(() => {
    const result = [];
    for (let i = 0; i < cards.length; i += maxConcurrent) {
      result.push(cards.slice(i, i + maxConcurrent));
    }
    return result;
  }, [cards, maxConcurrent]);

  // 为每批卡片创建动画配置
  const batchAnimations = useMemo(() => {
    return batches.map((batch, batchIndex) => {
      const baseDelay = batchIndex * maxConcurrent * staggerDelay;
      
      return batch.map((_, index) => {
        const actualIndex = batchIndex * maxConcurrent + index;
        return useCardAnimations({
          ...restOptions,
          index: actualIndex,
          staggerDelay,
        });
      });
    });
  }, [batches, maxConcurrent, staggerDelay, restOptions]);

  // 扁平化动画配置
  const animations = useMemo(() => {
    return batchAnimations.flat();
  }, [batchAnimations]);

  return {
    animations,
    totalCards: cards.length,
    batches: batches.length,
    maxConcurrent,
  };
};

/**
 * 性能优化的卡片动画Hook
 * @param {Object} options - 动画选项
 * @returns {Object} 性能优化的动画配置
 */
export const useOptimizedCardAnimations = (options = {}) => {
  const {
    enableIntersectionObserver = true,
    threshold = 0.1,
    rootMargin = '50px',
    ...restOptions
  } = options;

  const [isInView, setIsInView] = useState(!enableIntersectionObserver);
  const elementRef = useState(null)[1];

  // 交集观察器
  useEffect(() => {
    if (!enableIntersectionObserver || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [enableIntersectionObserver, threshold, rootMargin]);

  // 基础动画Hook
  const animationProps = useCardAnimations({
    ...restOptions,
    enableEntrance: restOptions.enableEntrance && isInView,
  });

  return {
    ...animationProps,
    elementRef,
    isInView,
  };
};

export default {
  useCardAnimations,
  useCardAnimationsBatch,
  useOptimizedCardAnimations,
};