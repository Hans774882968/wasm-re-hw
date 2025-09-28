import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCardAnimations } from '../../src/animations/useCardAnimations.js';

describe('useCardAnimations Hook 契约测试', () => {
  describe('默认配置测试', () => {
    it('应该返回默认的动画配置', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current).toHaveProperty('entranceProps');
      expect(result.current).toHaveProperty('hoverProps');
      expect(result.current).toHaveProperty('staggerProps');
      expect(result.current).toHaveProperty('animationState');
    });

    it('应该使用默认的动画时长', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.entranceProps.transition.duration).toBe(0.3);
      expect(result.current.hoverProps.transition.duration).toBe(0.2);
    });

    it('应该使用默认的悬停距离', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.hoverProps.whileHover.y).toBe(-4);
    });

    it('应该使用默认的延迟间隔', () => {
      const { result } = renderHook(() => useCardAnimations({ index: 1 }));

      expect(result.current.staggerProps.transition.delay).toBe(0.05);
    });
  });

  describe('自定义配置测试', () => {
    it('应该支持自定义入场动画时长', () => {
      const { result } = renderHook(() => useCardAnimations({
        entranceDuration: 500,
      }));

      expect(result.current.entranceProps.transition.duration).toBe(0.5);
    });

    it('应该支持自定义悬停动画时长', () => {
      const { result } = renderHook(() => useCardAnimations({
        hoverDuration: 100,
      }));

      expect(result.current.hoverProps.transition.duration).toBe(0.1);
    });

    it('应该支持自定义悬停距离', () => {
      const { result } = renderHook(() => useCardAnimations({
        hoverDistance: 10,
      }));

      expect(result.current.hoverProps.whileHover.y).toBe(-10);
    });

    it('应该支持自定义延迟间隔', () => {
      const { result } = renderHook(() => useCardAnimations({
        staggerDelay: 100,
        index: 2,
      }));

      expect(result.current.staggerProps.transition.delay).toBe(0.2);
    });
  });

  describe('动画状态管理测试', () => {
    it('应该正确管理动画状态', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.animationState).toHaveProperty('isVisible');
      expect(result.current.animationState).toHaveProperty('isHovered');
      expect(result.current.animationState).toHaveProperty('animationIndex');
      expect(result.current.animationState).toHaveProperty('animationConfig');
    });

    it('应该支持禁用入场动画', () => {
      const { result } = renderHook(() => useCardAnimations({
        enableEntrance: false,
      }));

      expect(result.current.entranceProps.initial).toEqual({});
      expect(result.current.entranceProps.animate).toEqual({});
    });

    it('应该支持禁用悬停动画', () => {
      const { result } = renderHook(() => useCardAnimations({
        enableHover: false,
      }));

      expect(result.current.hoverProps.whileHover).toEqual({});
    });
  });

  describe('入场动画属性测试', () => {
    it('应该返回正确的入场动画初始状态', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.entranceProps.initial).toEqual({
        opacity: 0,
        y: 20,
      });
    });

    it('应该返回正确的入场动画目标状态', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.entranceProps.animate).toEqual({
        opacity: 1,
        y: 0,
      });
    });

    it('应该包含正确的过渡配置', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.entranceProps.transition).toEqual({
        duration: 0.3,
        ease: 'ease',
      });
    });
  });

  describe('悬停动画属性测试', () => {
    it('应该返回正确的悬停动画配置', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.hoverProps.whileHover).toEqual({
        y: -4,
      });
    });

    it('应该包含正确的悬停过渡配置', () => {
      const { result } = renderHook(() => useCardAnimations());

      expect(result.current.hoverProps.transition).toEqual({
        duration: 0.2,
        ease: 'ease',
      });
    });
  });

  describe('延迟动画属性测试', () => {
    it('应该根据索引计算正确的延迟时间', () => {
      const { result } = renderHook(() => useCardAnimations({ index: 3 }));

      expect(result.current.staggerProps.transition.delay).toBe(0.15);
    });

    it('应该支持索引为0的情况', () => {
      const { result } = renderHook(() => useCardAnimations({ index: 0 }));

      expect(result.current.staggerProps.transition.delay).toBe(0);
    });
  });

  describe('错误处理测试', () => {
    it('应该处理无效的动画时长', () => {
      const { result } = renderHook(() => useCardAnimations({
        entranceDuration: -100,
      }));

      // 应该使用默认值或最小值
      expect(result.current.entranceProps.transition.duration).toBeGreaterThanOrEqual(0);
    });

    it('应该处理无效的悬停距离', () => {
      const { result } = renderHook(() => useCardAnimations({
        hoverDistance: 'invalid',
      }));

      // 应该使用默认值
      expect(typeof result.current.hoverProps.whileHover.y).toBe('number');
    });

    it('应该处理无效的索引', () => {
      const { result } = renderHook(() => useCardAnimations({ index: -1 }));

      // 应该使用默认值或最小值
      expect(result.current.staggerProps.transition.delay).toBeGreaterThanOrEqual(0);
    });
  });

  describe('性能监控测试', () => {
    it('应该提供性能监控数据', () => {
      const { result } = renderHook(() => useCardAnimations({
        enablePerformanceMonitoring: true,
      }));

      expect(result.current.animationState).toHaveProperty('performanceMetrics');
    });

    it('应该支持性能阈值配置', () => {
      const { result } = renderHook(() => useCardAnimations({
        performanceThreshold: 60, // 60fps
      }));

      expect(result.current.animationState.performanceThreshold).toBe(60);
    });
  });

  describe('响应式配置测试', () => {
    it('应该支持响应式动画配置', () => {
      const { result } = renderHook(() => useCardAnimations({
        responsive: true,
      }));

      expect(result.current.animationState).toHaveProperty('isReducedMotion');
    });

    it('应该检测用户偏好减少动画', () => {
      // 模拟 prefers-reduced-motion
      window.matchMedia = vi.fn(() => ({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const { result } = renderHook(() => useCardAnimations({
        responsive: true,
      }));

      expect(result.current.animationState.isReducedMotion).toBe(true);
    });
  });
});
