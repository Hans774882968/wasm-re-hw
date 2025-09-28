/**
 * 动画配置验证
 * @param {Object} config - 动画配置对象
 * @returns {Object} 验证结果 { isValid, errors }
 */
export const validateAnimationConfig = (config) => {
  const errors = [];

  if (!config) {
    errors.push('配置对象不能为空');
    return { isValid: false, errors };
  }

  // 验证入场动画配置
  if (config.entrance) {
    if (config.entrance.duration < 0) {
      errors.push('入场动画时长必须大于0');
    }

    const validEasings = ['ease', 'ease-in', 'ease-out', 'ease-in-out'];
    if (config.entrance.easing && !validEasings.includes(config.entrance.easing)) {
      errors.push(`不支持的缓动函数: ${config.entrance.easing}`);
    }
  }

  // 验证悬停动画配置
  if (config.hover) {
    if (config.hover.duration < 0) {
      errors.push('悬停动画时长必须大于0');
    }

    if (config.hover.y < -50 || config.hover.y > 50) {
      errors.push('悬停距离不能超过50px');
    }

    const validEasings = ['ease', 'ease-in', 'ease-out', 'ease-in-out'];
    if (config.hover.easing && !validEasings.includes(config.hover.easing)) {
      errors.push(`不支持的缓动函数: ${config.hover.easing}`);
    }
  }

  // 验证延迟动画配置
  if (config.stagger) {
    if (config.stagger.delay < 0) {
      errors.push('延迟间隔必须大于等于0');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 创建入场动画配置
 * @param {number} duration - 动画时长(ms)
 * @param {string} easing - 缓动函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Object} 入场动画配置
 */
export const createEntranceAnimation = (duration = 300, easing = 'ease', delay = 0) => {
  const validDuration = Math.max(0, Number(duration) || 300);
  const validDelay = Math.max(0, Number(delay) || 0);
  const validEasing = ['ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(easing)
    ? easing
    : 'ease';

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: validDuration / 1000, // 转换为秒
      ease: validEasing,
      delay: validDelay / 1000, // 转换为秒
    },
  };
};

/**
 * 创建悬停动画配置
 * @param {number} duration - 动画时长(ms)
 * @param {string} easing - 缓动函数
 * @param {number} distance - 悬停距离(px)
 * @returns {Object} 悬停动画配置
 */
export const createHoverAnimation = (duration = 200, easing = 'ease', distance = -4) => {
  const validDuration = Math.max(0, Number(duration) || 200);
  const validDistance = Math.max(-50, Math.min(50, Number(distance) || -4));
  const validEasing = ['ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(easing)
    ? easing
    : 'ease';

  return {
    whileHover: { y: validDistance },
    transition: {
      duration: validDuration / 1000, // 转换为秒
      ease: validEasing,
    },
  };
};

/**
 * 创建延迟动画配置
 * @param {number} staggerDelay - 延迟间隔(ms)
 * @param {number} index - 卡片索引
 * @returns {Object} 延迟动画配置
 */
export const createStaggerAnimation = (staggerDelay = 50, index = 0) => {
  const validDelay = Math.max(0, Number(staggerDelay) || 50);
  const validIndex = Math.max(0, Number(index) || 0);

  return {
    transition: {
      delay: (validIndex * validDelay) / 1000, // 转换为秒
    },
  };
};

/**
 * 获取动画状态
 * @param {string} state - 动画状态
 * @param {boolean} isHovered - 是否悬停
 * @param {number} index - 动画索引
 * @param {Object} config - 动画配置
 * @returns {Object} 动画状态对象
 */
export const getAnimationState = (state = 'idle', isHovered = false, index = 0, config = {}) => {
  const validStates = ['idle', 'entering', 'entered', 'exiting', 'error'];
  const currentState = validStates.includes(state) ? state : 'idle';

  return {
    state: currentState,
    isVisible: ['entering', 'entered'].includes(currentState),
    isHovered: Boolean(isHovered),
    animationIndex: Math.max(0, Number(index) || 0),
    animationConfig: config || {},
  };
};

/**
 * 性能监控
 * @param {Object} options - 监控选项
 * @returns {Object} 监控器对象
 */
export const performanceMonitor = (options = {}) => {
  const { threshold = 30 } = options;
  let startTime = 0;
  let metrics = {};

  const start = () => {
    startTime = performance.now();
    metrics = {
      startTime,
      animationType: 'unknown',
      fps: 60, // 默认60fps
    };
  };

  const end = (animationType = 'unknown') => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    metrics = {
      ...metrics,
      endTime,
      duration,
      animationType,
      fps: duration > 0 ? Math.min(60, Math.round(1000 / duration)) : 60,
      timestamp: Date.now(),
    };
  };

  const getMetrics = () => {
    return {
      ...metrics,
      isPerformanceGood: metrics.fps >= threshold,
    };
  };

  return {
    start,
    end,
    getMetrics,
  };
};

/**
 * 响应式动画配置
 * @param {Object} baseConfig - 基础配置
 * @returns {Object} 响应式配置
 */
export const responsiveAnimationConfig = (baseConfig = {}) => {
  // 检测用户是否偏好减少动画
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      isReducedMotion: true,
      animationConfig: {
        duration: 0,
        easing: 'linear',
        ...baseConfig,
      },
    };
  }

  return {
    isReducedMotion: false,
    animationConfig: baseConfig,
  };
};

/**
 * 动画状态枚举
 */
export const AnimationState = {
  IDLE: 'idle',
  ENTERING: 'entering',
  ENTERED: 'entered',
  EXITING: 'exiting',
  ERROR: 'error',
};

/**
 * 动画类型枚举
 */
export const AnimationType = {
  ENTRANCE: 'entrance',
  HOVER: 'hover',
  FOCUS: 'focus',
  CLICK: 'click',
};

/**
 * 默认动画配置
 */
export const defaultAnimationConfig = {
  entrance: {
    duration: 300,
    easing: 'ease',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  hover: {
    duration: 200,
    easing: 'ease',
    y: -4,
  },
  stagger: {
    delay: 50,
  },
};

/**
 * 错误处理工具函数
 * @param {Error} error - 错误对象
 * @param {string} component - 组件名称
 * @param {string} animationType - 动画类型
 * @returns {Object} 格式化的错误信息
 */
export const formatAnimationError = (error, component = 'Unknown', animationType = 'unknown') => {
  return {
    type: 'ANIMATION_ERROR',
    component,
    animation: animationType,
    error: error.message || error.toString(),
    timestamp: Date.now(),
    stack: error.stack,
  };
};

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间(ms)
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制(ms)
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 检查是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobile = () => {
  return window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 获取设备适当的动画配置
 * @param {Object} desktopConfig - 桌面端配置
 * @param {Object} mobileConfig - 移动端配置
 * @returns {Object} 设备适当的配置
 */
export const getDeviceAnimationConfig = (desktopConfig = {}, mobileConfig = {}) => {
  return isMobile() ? { ...desktopConfig, ...mobileConfig } : desktopConfig;
};

/**
 * CSS变量工具函数
 * @param {string} property - CSS属性名
 * @param {string} value - CSS属性值
 * @returns {Object} CSS变量对象
 */
export const createCSSVariables = (property, value) => {
  const cssVarName = `--animation-${property}`;
  return {
    [cssVarName]: value,
  };
};

/**
 * 量子玫瑰主题适配
 * @param {Object} config - 基础配置
 * @returns {Object} 主题适配后的配置
 */
export const applyQuantumRoseTheme = (config = {}) => {
  return {
    ...config,
    cssVariables: {
      '--quantum-rose-animation-primary': 'var(--quantum-rose-primary)',
      '--quantum-rose-animation-secondary': 'var(--quantum-rose-secondary)',
      '--quantum-rose-animation-shadow': 'var(--quantum-rose-shadow)',
    },
  };
};

export default {
  validateAnimationConfig,
  createEntranceAnimation,
  createHoverAnimation,
  createStaggerAnimation,
  getAnimationState,
  performanceMonitor,
  responsiveAnimationConfig,
  AnimationState,
  AnimationType,
  defaultAnimationConfig,
  formatAnimationError,
  debounce,
  throttle,
  isMobile,
  getDeviceAnimationConfig,
  createCSSVariables,
  applyQuantumRoseTheme,
};