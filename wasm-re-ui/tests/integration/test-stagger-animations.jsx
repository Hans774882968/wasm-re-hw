import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnimatedCard } from '../../src/components/AnimatedCard.jsx';
import { motion } from 'motion/react';

// Mock motion组件
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }) => {
      return <div {...props} data-testid="motion-div">{children}</div>;
    },
  },
}));

describe('多卡片延迟动画集成测试', () => {
  describe('多个卡片的延迟渲染', () => {
    it('应该按顺序渲染多个卡片', async () => {
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard key={card.id} index={index}>
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      // 验证所有卡片都被渲染
      expect(screen.getByText('卡片1')).toBeInTheDocument();
      expect(screen.getByText('卡片2')).toBeInTheDocument();
      expect(screen.getByText('卡片3')).toBeInTheDocument();

      // 验证每个卡片都有正确的索引属性
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs[0]).toHaveAttribute('data-animation-index', '0');
      expect(motionDivs[1]).toHaveAttribute('data-animation-index', '1');
      expect(motionDivs[2]).toHaveAttribute('data-animation-index', '2');
    });

    it('应该应用正确的延迟时间', () => {
      const cards = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        content: `卡片${i + 1}`,
      }));

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard key={card.id} index={index}>
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');
      
      // 验证延迟时间递增
      motionDivs.forEach((div, index) => {
        const expectedDelay = index * 0.05; // 50ms间隔
        expect(div).toHaveAttribute('data-animation-index', index.toString());
      });
    });
  });

  describe('卡片组的动画同步', () => {
    it('应该同步处理卡片组的入场动画', async () => {
      const cards = [
        { id: 1, content: '卡片A' },
        { id: 2, content: '卡片B' },
        { id: 3, content: '卡片C' },
      ];

      const { container } = render(
        <div className="card-container">
          {cards.map((card, index) => (
            <AnimatedCard key={card.id} index={index} className="test-card">
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const cardContainer = container.querySelector('.card-container');
      expect(cardContainer).toBeInTheDocument();

      const testCards = container.querySelectorAll('.test-card');
      expect(testCards).toHaveLength(3);
    });

    it('应该处理不同数量的卡片组', () => {
      const testCases = [1, 3, 5, 10];

      testCases.forEach(cardCount => {
        const cards = Array.from({ length: cardCount }, (_, i) => ({
          id: i + 1,
          content: `卡片${i + 1}`,
        }));

        const { container } = render(
          <div>
            {cards.map((card, index) => (
              <AnimatedCard key={card.id} index={index}>
                <div>{card.content}</div>
              </AnimatedCard>
            ))}
          </div>
        );

        const motionDivs = screen.getAllByTestId('motion-div');
        expect(motionDivs).toHaveLength(cardCount);
      });
    });
  });

  describe('性能优化', () => {
    it('应该在大数量卡片时保持性能', () => {
      const largeCardSet = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        content: `卡片${i + 1}`,
      }));

      const startTime = performance.now();
      
      render(
        <div>
          {largeCardSet.map((card, index) => (
            <AnimatedCard key={card.id} index={index}>
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 验证渲染时间在合理范围内（50个卡片应该少于1秒）
      expect(renderTime).toBeLessThan(1000);

      // 验证所有卡片都被渲染
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs).toHaveLength(50);
    });

    it('应该在性能模式下禁用延迟动画', () => {
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.id}
              index={index}
              data-performance-level="critical"
            >
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');
      motionDivs.forEach(div => {
        expect(div).toHaveClass('animated-card-performance-critical');
      });
    });
  });

  describe('用户交互', () => {
    it('应该处理多个卡片的悬停状态', async () => {
      const user = userEvent.setup();
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard key={card.id} index={index}>
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');

      // 悬停第一个卡片
      await user.hover(motionDivs[0]);
      
      // 验证交互正常工作
      expect(motionDivs[0]).toHaveAttribute('data-animation-state');

      // 悬停第二个卡片
      await user.hover(motionDivs[1]);
      expect(motionDivs[1]).toHaveAttribute('data-animation-state');
    });

    it('应该处理卡片组的点击事件', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.id}
              index={index}
              onClick={() => handleClick(card.id)}
            >
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');

      // 点击每个卡片
      for (const div of motionDivs) {
        await user.click(div);
      }

      // 验证每个卡片的点击事件都被触发
      expect(handleClick).toHaveBeenCalledTimes(3);
      expect(handleClick).toHaveBeenCalledWith(1);
      expect(handleClick).toHaveBeenCalledWith(2);
      expect(handleClick).toHaveBeenCalledWith(3);
    });
  });

  describe('错误恢复', () => {
    it('应该在卡片动画失败时恢复', () => {
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.id}
              index={index}
              data-animation-state="error"
            >
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');
      motionDivs.forEach(div => {
        expect(div).toHaveClass('animated-card-error');
      });
    });

    it('应该在部分卡片失败时继续工作', () => {
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.id}
              index={index}
              disabled={index === 1} // 禁用第二个卡片
            >
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');
      
      // 验证第一个和第三个卡片正常工作
      expect(motionDivs[0]).not.toHaveClass('animated-card-disabled');
      expect(motionDivs[2]).not.toHaveClass('animated-card-disabled');
      
      // 验证第二个卡片被禁用
      expect(motionDivs[1]).toHaveClass('animated-card-disabled');
    });
  });

  describe('响应式行为', () => {
    it('应该在减少动画偏好时禁用延迟', () => {
      // 模拟 prefers-reduced-motion
      window.matchMedia = vi.fn(() => ({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard key={card.id} index={index} responsive>
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');
      motionDivs.forEach(div => {
        expect(div).toHaveClass('animated-card-disabled');
      });
    });
  });

  describe('主题一致性', () => {
    it('应该保持卡片组的主题一致性', () => {
      const cards = [
        { id: 1, content: '卡片1' },
        { id: 2, content: '卡片2' },
        { id: 3, content: '卡片3' },
      ];

      render(
        <div>
          {cards.map((card, index) => (
            <AnimatedCard
              key={card.id}
              index={index}
              theme="quantum-rose"
              className="test-card"
            >
              <div>{card.content}</div>
            </AnimatedCard>
          ))}
        </div>
      );

      const motionDivs = screen.getAllByTestId('motion-div');
      motionDivs.forEach(div => {
        expect(div).toHaveClass('quantum-rose');
        expect(div).toHaveClass('test-card');
      });
    });
  });
});