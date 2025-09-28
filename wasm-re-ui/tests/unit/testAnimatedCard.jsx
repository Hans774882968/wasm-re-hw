import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnimatedCard } from '../../src/components/AnimatedCard.jsx';

// Mock motion组件
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }) => {
      return <div {...props} data-testid="motion-div">{children}</div>;
    },
  },
}));

describe('AnimatedCard 组件契约测试', () => {
  describe('基础渲染测试', () => {
    it('应该正确渲染子元素', () => {
      render(
        <AnimatedCard>
          <div>测试内容</div>
        </AnimatedCard>
      );

      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });

    it('应该应用自定义类名', () => {
      render(
        <AnimatedCard className="custom-class">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('custom-class');
    });

    it('应该渲染为motion.div组件', () => {
      render(
        <AnimatedCard>
          <div>测试内容</div>
        </AnimatedCard>
      );

      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    });
  });

  describe('动画配置测试', () => {
    it('应该应用默认的动画配置', () => {
      render(
        <AnimatedCard>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-animation-state');
    });

    it('应该应用自定义动画配置', () => {
      const customConfig = {
        entrance: { duration: 500, easing: 'ease-in' },
        hover: { duration: 100, distance: 8 },
      };

      render(
        <AnimatedCard animationConfig={customConfig}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-animation-config');
    });

    it('应该支持索引配置', () => {
      render(
        <AnimatedCard index={2}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-animation-index', '2');
    });
  });

  describe('禁用状态测试', () => {
    it('应该支持禁用动画', () => {
      render(
        <AnimatedCard disabled>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card-disabled');
    });

    it('应该在禁用时仍然渲染内容', () => {
      render(
        <AnimatedCard disabled>
          <div>测试内容</div>
        </AnimatedCard>
      );

      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });
  });

  describe('事件处理测试', () => {
    it('应该处理鼠标进入事件', async () => {
      const user = userEvent.setup();
      const onMouseEnter = vi.fn();

      render(
        <AnimatedCard onMouseEnter={onMouseEnter}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      await user.hover(card);

      expect(onMouseEnter).toHaveBeenCalled();
    });

    it('应该处理鼠标离开事件', async () => {
      const user = userEvent.setup();
      const onMouseLeave = vi.fn();

      render(
        <AnimatedCard onMouseLeave={onMouseLeave}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      await user.hover(card);
      await user.unhover(card);

      expect(onMouseLeave).toHaveBeenCalled();
    });

    it('应该处理点击事件', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <AnimatedCard onClick={onClick}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      await user.click(card);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('动画生命周期测试', () => {
    it('应该处理动画开始事件', () => {
      const onAnimationStart = vi.fn();

      render(
        <AnimatedCard onAnimationStart={onAnimationStart}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animation-state');
    });

    it('应该处理动画完成事件', () => {
      const onAnimationComplete = vi.fn();

      render(
        <AnimatedCard onAnimationComplete={onAnimationComplete}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      expect(screen.getByTestId('motion-div')).toHaveAttribute('data-animation-state');
    });
  });

  describe('错误处理测试', () => {
    it('应该处理动画错误', () => {
      const onAnimationError = vi.fn();

      render(
        <AnimatedCard onAnimationError={onAnimationError}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-animation-state');
    });

    it('应该在错误时显示错误状态', () => {
      render(
        <AnimatedCard data-animation-state="error">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card-error');
    });
  });

  describe('性能监控测试', () => {
    it('应该支持性能监控', () => {
      const onPerformanceUpdate = vi.fn();

      render(
        <AnimatedCard onPerformanceUpdate={onPerformanceUpdate}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-performance-metrics');
    });

    it('应该在性能低时应用降级样式', () => {
      render(
        <AnimatedCard data-performance-level="low">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card-performance-low');
    });

    it('应该在性能严重低时禁用动画', () => {
      render(
        <AnimatedCard data-performance-level="critical">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card-performance-critical');
    });
  });

  describe('响应式测试', () => {
    it('应该支持响应式配置', () => {
      render(
        <AnimatedCard responsive>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-responsive', 'true');
    });

    it('应该在减少动画偏好时禁用动画', () => {
      // 模拟matchMedia
      window.matchMedia = vi.fn(() => ({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      render(
        <AnimatedCard responsive>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card-disabled');
    });
  });

  describe('调试模式测试', () => {
    it('应该支持调试模式', () => {
      render(
        <AnimatedCard debug>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card-debug');
    });

    it('应该在调试模式下显示调试信息', () => {
      render(
        <AnimatedCard debug data-animation-debug="test-debug">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-animation-debug', 'test-debug');
    });
  });

  describe('主题集成测试', () => {
    it('应该支持量子玫瑰主题', () => {
      render(
        <AnimatedCard theme="quantum-rose">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('quantum-rose');
    });

    it('应该应用主题相关的动画样式', () => {
      render(
        <AnimatedCard theme="quantum-rose">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('animated-card');
    });
  });

  describe('可访问性测试', () => {
    it('应该支持键盘导航', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      render(
        <AnimatedCard onKeyDown={onKeyDown} tabIndex={0}>
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      card.focus();
      await user.keyboard('{Enter}');

      expect(onKeyDown).toHaveBeenCalled();
    });

    it('应该支持ARIA属性', () => {
      render(
        <AnimatedCard role="button" aria-label="动画卡片">
          <div>测试内容</div>
        </AnimatedCard>
      );

      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('aria-label', '动画卡片');
    });
  });
});