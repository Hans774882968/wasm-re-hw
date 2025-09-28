/**
 * 响应式动画配置
 * 根据不同设备和屏幕尺寸提供优化的动画参数
 */

// 基础断点配置
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

// 设备类型检测
export const detectDeviceType = () => {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 检测移动设备
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  if (isMobileDevice || width <= BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width <= BREAKPOINTS.tablet) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// 检测用户动画偏好
export const detectMotionPreference = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return { prefersReducedMotion: false, prefersHighContrast: false };
  }
  
  return {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
  };
};

// 检测设备性能
export const detectDevicePerformance = () => {
  if (typeof navigator === 'undefined') {
    return { isLowEnd: false, hardwareConcurrency: 4, deviceMemory: 8 };
  }
  
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = navigator.deviceMemory || 8;
  const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 4;
  
  return {
    isLowEnd,
    hardwareConcurrency,
    deviceMemory,
    isHighEnd: hardwareConcurrency >= 8 && deviceMemory >= 16,
  };
};

/**
 * 响应式动画配置工厂函数
 * @param {Object} baseConfig - 基础动画配置
 * @param {Object} overrides - 特定设备的配置覆盖
 * @returns {Object} 响应式动画配置
 */
export const createResponsiveConfig = (baseConfig = {}, overrides = {}) => {
  const deviceType = detectDeviceType();
  const { prefersReducedMotion } = detectMotionPreference();
  const { isLowEnd } = detectDevicePerformance();
  
  // 如果用户偏好减少动画，直接返回简化配置
  if (prefersReducedMotion) {
    return {
      entrance: { duration: 0, easing: 'linear', initial: {}, animate: {} },
      hover: { duration: 0, easing: 'linear', y: 0 },
      stagger: { delay: 0 },
      isReducedMotion: true,
    };
  }
  
  // 设备特定的默认配置
  const deviceDefaults = {
    mobile: {
      entrance: { duration: 200, easing: 'ease-out' },
      hover: { duration: 150, easing: 'ease', y: -2 },
      stagger: { delay: 30 },
    },
    tablet: {
      entrance: { duration: 250, easing: 'ease' },
      hover: { duration: 180, easing: 'ease', y: -3 },
      stagger: { delay: 40 },
    },
    desktop: {
      entrance: { duration: 300, easing: 'ease' },
      hover: { duration: 200, easing: 'ease', y: -4 },
      stagger: { delay: 50 },
    },
  };
  
  // 低性能设备配置调整
  const performanceAdjustments = isLowEnd ? {
    entrance: { duration: Math.floor(deviceDefaults[deviceType].entrance.duration * 0.7) },
    hover: { duration: Math.floor(deviceDefaults[deviceType].hover.duration * 0.7) },
    stagger: { delay: Math.floor(deviceDefaults[deviceType].stagger.delay * 0.8) },
  } : {};
  
  // 合并配置
  const responsiveConfig = {
    ...deviceDefaults[deviceType],
    ...performanceAdjustments,
    ...baseConfig,
    ...(overrides[deviceType] || {}),
  };
  
  return {
    ...responsiveConfig,
    deviceType,
    isLowEnd,
    isReducedMotion: false,
  };
};

/**
 * 移动端动画配置
 * 针对触摸设备和有限屏幕空间的优化
 */
export const mobileAnimationConfig = {
  entrance: {
    duration: 200,
    easing: 'ease-out',
    initial: { opacity: 0, y: 15 }, // 减少移动距离
    animate: { opacity: 1, y: 0 },
  },
  hover: {
    duration: 150,
    easing: 'ease',
    y: -2, // 减少悬停距离
    scale: 1, // 禁用缩放
  },
  stagger: {
    delay: 30, // 减少延迟
  },
};

/**
 * 平板端动画配置
 * 平衡性能和视觉效果的中间配置
 */
export const tabletAnimationConfig = {
  entrance: {
    duration: 250,
    easing: 'ease',
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  },
  hover: {
    duration: 180,
    easing: 'ease',
    y: -3,
    scale: 1,
  },
  stagger: {
    delay: 40,
  },
};

/**
 * 桌面端动画配置
 * 完整功能的动画配置
 */
export const desktopAnimationConfig = {
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
    scale: 1,
  },
  stagger: {
    delay: 50,
  },
};

/**
 * 低性能设备配置
 * 针对低端设备的性能优化
 */
export const lowEndDeviceConfig = {
  entrance: {
    duration: 150,
    easing: 'linear',
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
  hover: {
    duration: 100,
    easing: 'linear',
    y: -1,
    scale: 1,
  },
  stagger: {
    delay: 20,
  },
};

/**
 * 高性能设备配置
 * 针对高端设备的增强动画
 */
export const highEndDeviceConfig = {
  entrance: {
    duration: 400,
    easing: 'ease-out',
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
  },
  hover: {
    duration: 250,
    easing: 'ease-in-out',
    y: -6,
    scale: 1,
    rotate: 1, // 轻微旋转效果
  },
  stagger: {
    delay: 60,
  },
};

/**
 * 无障碍友好配置
 * 符合WCAG标准的动画配置
 */
export const accessibilityConfig = {
  entrance: {
    duration: 250,
    easing: 'ease-out',
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
  },
  hover: {
    duration: 200,
    easing: 'ease',
    y: -3,
    scale: 1,
    // 确保有足够的颜色对比度
    contrast: true,
  },
  stagger: {
    delay: 40,
  },
  // 提供暂停动画的选项
  pauseOnHover: true,
  // 提供跳过动画的快捷键
  keyboardShortcut: true,
};

/**
 * 响应式工具函数：获取当前设备配置
 * @returns {Object} 当前设备的最优动画配置
 */
export const getCurrentDeviceConfig = () => {
  const deviceType = detectDeviceType();
  const { prefersReducedMotion } = detectMotionPreference();
  const { isLowEnd, isHighEnd } = detectDevicePerformance();
  
  if (prefersReducedMotion) {
    return {
      ...accessibilityConfig,
      isReducedMotion: true,
    };
  }
  
  if (isLowEnd) {
    return {
      ...lowEndDeviceConfig,
      deviceType,
      isLowEnd: true,
    };
  }
  
  if (isHighEnd) {
    return {
      ...highEndDeviceConfig,
      deviceType,
      isHighEnd: true,
    };
  }
  
  // 根据设备类型返回标准配置
  const deviceConfigs = {
    mobile: mobileAnimationConfig,
    tablet: tabletAnimationConfig,
    desktop: desktopAnimationConfig,
  };
  
  return {
    ...deviceConfigs[deviceType],
    deviceType,
    isStandard: true,
  };
};

/**
 * 监听设备配置变化
 * @param {Function} callback - 配置变化时的回调函数
 * @returns {Function} 清理函数
 */
export const subscribeToDeviceConfigChanges = (callback) => {
  let currentConfig = getCurrentDeviceConfig();
  
  const checkForChanges = () => {
    const newConfig = getCurrentDeviceConfig();
    if (JSON.stringify(newConfig) !== JSON.stringify(currentConfig)) {
      currentConfig = newConfig;
      callback(newConfig);
    }
  };
  
  // 监听窗口大小变化
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkForChanges, 100);
  };
  
  window.addEventListener('resize', handleResize);
  
  // 监听媒体查询变化
  const mediaQueries = [
    window.matchMedia('(prefers-reduced-motion: reduce)'),
    window.matchMedia('(prefers-contrast: high)'),
    window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`),
    window.matchMedia(`(max-width: ${BREAKPOINTS.tablet}px)`),
  ];
  
  mediaQueries.forEach(mq => {
    if (mq.addEventListener) {
      mq.addEventListener('change', checkForChanges);
    } else if (mq.addListener) {
      mq.addListener(checkForChanges);
    }
  });
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimeout);
    
    mediaQueries.forEach(mq => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', checkForChanges);
      } else if (mq.removeListener) {
        mq.removeListener(checkForChanges);
      }
    });
  };
};

/**
 * CSS媒体查询工具函数
 * @returns {Object} 媒体查询结果
 */
export const getMediaQueries = () => ({
  isMobile: window.innerWidth <= BREAKPOINTS.mobile,
  isTablet: window.innerWidth <= BREAKPOINTS.tablet && window.innerWidth > BREAKPOINTS.mobile,
  isDesktop: window.innerWidth > BREAKPOINTS.tablet,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
});

export default {
  BREAKPOINTS,
  detectDeviceType,
  detectMotionPreference,
  detectDevicePerformance,
  createResponsiveConfig,
  mobileAnimationConfig,
  tabletAnimationConfig,
  desktopAnimationConfig,
  lowEndDeviceConfig,
  highEndDeviceConfig,
  accessibilityConfig,
  getCurrentDeviceConfig,
  subscribeToDeviceConfigChanges,
  getMediaQueries,
};