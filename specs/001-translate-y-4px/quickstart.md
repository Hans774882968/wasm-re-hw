# 卡片动画效果优化 - 快速开始指南

**功能分支**: 001-translate-y-4px  
**文档版本**: 1.0.0  
**最后更新**: 2025-09-28

## 快速概述

本功能为WASM逆向工程学习平台的所有页面卡片元素添加统一的动画效果，包括：

- **入场动画**: 淡入 + 从下方滑入，300ms，ease缓动
- **悬停动画**: 向上移动4px，200ms，ease缓动  
- **多卡片效果**: 顺序延迟50ms出现
- **技术栈**: motion库 + React Hooks，单元测试使用Vitest

## 快速开始

### 1. 安装依赖

```bash
# 进入前端目录
cd wasm-re-ui

# 安装motion库
bun add motion
```

### 2. 基础使用

#### 在组件中使用useCardAnimations Hook

```javascript
import { useCardAnimations } from '@/animations/useCardAnimations';

function MyCard({ children, index }) {
  const { entranceProps, hoverProps } = useCardAnimations({
    index,
    entranceDuration: 300,
    hoverDuration: 200,
    hoverDistance: 4
  });

  return (
    <motion.div
      {...entranceProps}
      {...hoverProps}
      className="card"
    >
      {children}
    </motion.div>
  );
}
```

#### 使用AnimatedCard组件

```javascript
import { AnimatedCard } from '@/components/AnimatedCard';

function MyPage() {
  const cards = [
    { title: '卡片1', content: '内容1' },
    { title: '卡片2', content: '内容2' },
    { title: '卡片3', content: '内容3' }
  ];

  return (
    <div className="container">
      {cards.map((card, index) => (
        <AnimatedCard key={index} index={index}>
          <div className="card">
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}
```

### 3. 配置选项

#### 完整配置示例

```javascript
const animationConfig = {
  // 入场动画配置
  entrance: {
    duration: 300,        // 持续时间(ms)
    easing: "ease",       // 缓动函数
    initial: {           // 初始状态
      opacity: 0,        // 透明度
      y: 20              // Y轴位移
    },
    animate: {           // 目标状态
      opacity: 1,        // 透明度
      y: 0               // Y轴位移
    }
  },
  
  // 悬停动画配置
  hover: {
    duration: 200,       // 持续时间(ms)
    easing: "ease",       // 缓动函数
    distance: 4          // 移动距离(px)
  },
  
  // 多卡片配置
  stagger: {
    delay: 50            // 延迟间隔(ms)
  }
};

// 使用自定义配置
const { entranceProps, hoverProps } = useCardAnimations(animationConfig);
```

#### 简化配置

```javascript
// 只需要修改的参数
const { entranceProps, hoverProps } = useCardAnimations({
  entranceDuration: 400,  // 自定义入场时长
  hoverDistance: 6        // 自定义悬停距离
});
```

### 4. 事件处理

```javascript
function MyComponent() {
  const handleAnimationStart = (animationType) => {
    console.log(`${animationType} 动画开始`);
  };

  const handleAnimationComplete = (animationType) => {
    console.log(`${animationType} 动画完成`);
  };

  const handleError = (error) => {
    console.error('动画错误:', error);
    toast.error('动画执行失败');
  };

  const { entranceProps, hoverProps } = useCardAnimations({
    onAnimationStart: handleAnimationStart,
    onAnimationComplete: handleAnimationComplete,
    onError: handleError
  });

  return (
    <motion.div {...entranceProps} {...hoverProps}>
      内容
    </motion.div>
  );
}
```

### 5. 现有组件迁移指南

#### 迁移前 (普通div)

```javascript
// 原有代码
<div className="demo-card">
  <h3>AES-CBC 演示</h3>
  <p>加密算法演示</p>
</div>
```

#### 迁移后 (动画卡片)

```javascript
// 修改后的代码
import { AnimatedCard } from '@/components/AnimatedCard';

<AnimatedCard className="demo-card">
  <h3>AES-CBC 演示</h3>
  <p>加密算法演示</p>
</AnimatedCard>
```

### 6. 批量迁移脚本

```bash
# 在项目根目录执行
find wasm-re-ui/src -name "*.jsx" -type f -exec grep -l "className.*card" {} \;

# 手动替换以下模式：
# <div className="card"> → <AnimatedCard className="card">
# </div> → </AnimatedCard>
```

### 7. 性能优化建议

#### 大量卡片优化

```javascript
// 使用虚拟滚动 + 动画
import { VirtualizedList } from '@/components/VirtualizedList';

function LargeCardList({ cards }) {
  return (
    <VirtualizedList
      items={cards}
      renderItem={(card, index) => (
        <AnimatedCard key={card.id} index={index}>
          {card.content}
        </AnimatedCard>
      )}
    />
  );
}
```

#### 条件渲染优化

```javascript
function ConditionalAnimation({ children, shouldAnimate }) {
  const { entranceProps, hoverProps } = useCardAnimations({
    enableEntrance: shouldAnimate,
    enableHover: shouldAnimate
  });

  if (!shouldAnimate) {
    return <div className="card">{children}</div>;
  }

  return (
    <motion.div {...entranceProps} {...hoverProps} className="card">
      {children}
    </motion.div>
  );
}
```

### 8. 调试和测试

#### 开发环境调试

```javascript
// 开启调试模式
const { entranceProps, hoverProps, animationState } = useCardAnimations({
  debug: true
});

// 监听动画状态
useEffect(() => {
  if (animationState.error) {
    console.error('动画错误:', animationState.error);
  }
}, [animationState]);
```

#### 性能监控

```javascript
// 性能监控回调
const handlePerformanceMetrics = (metrics) => {
  if (metrics.fps < 30) {
    console.warn('动画性能较低:', metrics);
  }
};

const { entranceProps } = useCardAnimations({
  onPerformanceMetrics: handlePerformanceMetrics
});
```

### 9. 常见问题

#### Q: 如何禁用特定动画？

```javascript
// 禁用入场动画
const { entranceProps, hoverProps } = useCardAnimations({
  enableEntrance: false
});

// 禁用悬停动画
const { entranceProps, hoverProps } = useCardAnimations({
  enableHover: false
});
```

#### Q: 如何自定义动画效果？

```javascript
// 完全自定义动画配置
const customConfig = {
  entrance: {
    duration: 500,
    easing: "ease-out",
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 }
  }
};

const { entranceProps } = useCardAnimations(customConfig);
```

#### Q: 移动端适配问题？

```javascript
// 响应式配置
const getResponsiveConfig = () => {
  const isMobile = window.innerWidth < 768;
  return {
    entranceDuration: isMobile ? 200 : 300,
    hoverDistance: isMobile ? 2 : 4
  };
};

const config = getResponsiveConfig();
const { entranceProps, hoverProps } = useCardAnimations(config);
```

### 10. 下一步

1. **阅读完整文档**: 查看`data-model.md`了解完整的数据结构设计
2. **查看API契约**: 参考`contracts/animation-api.md`了解详细API
3. **运行测试**: 执行`bun test`验证功能正确性
4. **性能测试**: 在不同设备上测试动画性能
5. **提交代码**: 遵循项目代码规范提交更改

## 支持和反馈

如遇到问题，请：
1. 查看控制台错误信息
2. 检查motion库版本兼容性
3. 参考项目宪法规范
4. 联系开发团队获取支持
