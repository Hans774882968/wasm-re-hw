import { describe, it, expect, vi } from 'vitest';
import {
  validateAnimationConfig,
  createEntranceAnimation,
  createHoverAnimation,
  createStaggerAnimation,
  getAnimationState,
  performanceMonitor,
  responsiveAnimationConfig,
} from '../../src/animations/animationUtils.js';

describe('动画配置验证 契约测试', () => {
  describe('validateAnimationConfig 函数测试', () => {
    it('应该验证有效的动画配置', () => {
      const config = {
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

      const result = validateAnimationConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('应该拒绝无效的动画时长', () => {
      const config = {
        entrance: {
          duration: -100,
          easing: 'ease',
        },
      };

      const result = validateAnimationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('入场动画时长必须大于0');
    });

    it('应该拒绝无效的缓动函数', () => {
      const config = {
        entrance: {
          duration: 300,
          easing: 'invalid-easing',
        },
      };

      const result = validateAnimationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('不支持的缓动函数: invalid-easing');
    });

    it('应该拒绝悬停距离过大', () => {
      const config = {
        hover: {
          duration: 200,
          easing: 'ease',
          y: -100,
        },
      };

      const result = validateAnimationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('悬停距离不能超过50px');
    });

    it('应该验证延迟间隔', () => {
      const config = {
        stagger: {
          delay: -10,
        },
      };

      const result = validateAnimationConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('延迟间隔必须大于等于0');
    });
  });

  describe('createEntranceAnimation 函数测试', () => {
    it('应该创建入场动画配置', () => {
      const result = createEntranceAnimation(300, 'ease', 0);

      expect(result).toHaveProperty('initial');
      expect(result).toHaveProperty('animate');
      expect(result).toHaveProperty('transition');
      expect(result.initial).toEqual({ opacity: 0, y: 20 });
      expect(result.animate).toEqual({ opacity: 1, y: 0 });
    });

    it('应该应用自定义延迟', () => {
      const result = createEntranceAnimation(300, 'ease', 150);

      expect(result.transition.delay).toBe(0.15);
    });

    it('应该使用正确的时长和缓动', () => {
      const result = createEntranceAnimation(500, 'ease-in', 0);

      expect(result.transition.duration).toBe(0.5);
      expect(result.transition.ease).toBe('ease-in');
    });
  });

  describe('createHoverAnimation 函数测试', () => {
    it('应该创建悬停动画配置', () => {
      const result = createHoverAnimation(200, 'ease', -4);

      expect(result).toHaveProperty('whileHover');
      expect(result).toHaveProperty('transition');
      expect(result.whileHover).toEqual({ y: -4 });
    });

    it('应该使用正确的时长和缓动', () => {
      const result = createHoverAnimation(100, 'ease-out', -8);

      expect(result.transition.duration).toBe(0.1);
      expect(result.transition.ease).toBe('ease-out');
      expect(result.whileHover.y).toBe(-8);
    });
  });

  describe('createStaggerAnimation 函数测试', () => {
    it('应该创建延迟动画配置', () => {
      const result = createStaggerAnimation(50, 2);

      expect(result).toHaveProperty('transition');
      expect(result.transition.delay).toBe(0.1);
    });

    it('应该正确处理索引0', () => {
      const result = createStaggerAnimation(50, 0);

      expect(result.transition.delay).toBe(0);
    });

    it('应该正确处理不同的延迟间隔', () => {
      const result = createStaggerAnimation(100, 3);

      expect(result.transition.delay).toBe(0.3);
    });
  });

  describe('getAnimationState 函数测试', () => {
    it('应该返回正确的动画状态', () => {
      const state = getAnimationState('entering', false, 1, {});

      expect(state).toHaveProperty('state');
      expect(state).toHaveProperty('isVisible');
      expect(state).toHaveProperty('isHovered');
      expect(state).toHaveProperty('animationIndex');
      expect(state.state).toBe('entering');
      expect(state.isVisible).toBe(true);
      expect(state.isHovered).toBe(false);
      expect(state.animationIndex).toBe(1);
    });

    it('应该处理悬停状态', () => {
      const state = getAnimationState('entered', true, 0, {});

      expect(state.isHovered).toBe(true);
    });

    it('应该处理不同的动画状态', () => {
      const states = ['idle', 'entering', 'entered', 'exiting', 'error'];

      states.forEach(stateName => {
        const state = getAnimationState(stateName, false, 0, {});
        expect(state.state).toBe(stateName);
      });
    });
  });

  describe('performanceMonitor 函数测试', () => {
    it('应该监控动画性能', () => {
      const monitor = performanceMonitor();

      expect(monitor).toHaveProperty('start');
      expect(monitor).toHaveProperty('end');
      expect(monitor).toHaveProperty('getMetrics');
      expect(typeof monitor.start).toBe('function');
      expect(typeof monitor.end).toBe('function');
      expect(typeof monitor.getMetrics).toBe('function');
    });

    it('应该正确计算动画时长', () => {
      const monitor = performanceMonitor();

      monitor.start();
      // 模拟一些时间过去
      const startTime = performance.now();
      const endTime = startTime + 100;

      monitor.end();
      const metrics = monitor.getMetrics();

      expect(metrics).toHaveProperty('duration');
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('timestamp');
    });

    it('应该检测性能问题', () => {
      const monitor = performanceMonitor({ threshold: 30 });

      monitor.start();
      monitor.end();
      const metrics = monitor.getMetrics();

      expect(metrics).toHaveProperty('isPerformanceGood');
      expect(typeof metrics.isPerformanceGood).toBe('boolean');
    });
  });

  describe('responsiveAnimationConfig 函数测试', () => {
    it('应该返回响应式动画配置', () => {
      const config = responsiveAnimationConfig();

      expect(config).toHaveProperty('isReducedMotion');
      expect(config).toHaveProperty('animationConfig');
      expect(typeof config.isReducedMotion).toBe('boolean');
    });

    it('应该检测 prefers-reduced-motion', () => {
      // 模拟 matchMedia
      window.matchMedia = vi.fn(() => ({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const config = responsiveAnimationConfig();

      expect(config.isReducedMotion).toBe(true);
    });

    it('应该返回适当的动画配置', () => {
      const config = responsiveAnimationConfig();

      expect(config.animationConfig).toHaveProperty('duration');
      expect(config.animationConfig).toHaveProperty('easing');

      if (config.isReducedMotion) {
        expect(config.animationConfig.duration).toBe(0);
      }
    });
  });

  describe('错误处理测试', () => {
    it('应该处理无效的输入参数', () => {
      const result = validateAnimationConfig(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('配置对象不能为空');
    });

    it('应该处理缺失的必需字段', () => {
      const result = validateAnimationConfig({});

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('应该处理类型错误的参数', () => {
      const result = createEntranceAnimation('invalid', 'ease', 0);

      // 应该使用默认值或进行类型转换
      expect(result.transition.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理极小的动画时长', () => {
      const result = createEntranceAnimation(1, 'ease', 0);

      expect(result.transition.duration).toBe(0.001);
    });

    it('应该处理极大的索引值', () => {
      const result = createStaggerAnimation(50, 1000);

      expect(result.transition.delay).toBe(50);
    });

    it('应该处理负数索引', () => {
      const result = createStaggerAnimation(50, -1);

      expect(result.transition.delay).toBe(0);
    });
  });
});