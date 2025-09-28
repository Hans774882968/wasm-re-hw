# 卡片动画效果优化 - 数据模型设计

**设计日期**: 2025-09-28  
**功能分支**: 001-translate-y-4px

## 动画配置数据结构

### 1. 卡片动画配置对象

```javascript
{
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
    y: -4                // Y轴位移
  },
  
  // 多卡片动画配置
  stagger: {
    delay: 50            // 卡片间延迟(ms)
  }
}
```

### 2. 组件动画状态

```javascript
{
  isVisible: boolean,      // 是否可见
  isHovered: boolean,      // 是否悬停
  animationIndex: number,  // 动画索引（用于延迟）
  animationConfig: object  // 动画配置对象
}
```

## React组件接口设计

### 1. useCardAnimations Hook 接口

```javascript
const useCardAnimations = (options = {}) => {
  // 参数
  const {
    entranceDuration = 300,     // 入场动画时长
    hoverDuration = 200,        // 悬停动画时长
    hoverDistance = 4,          // 悬停距离
    staggerDelay = 50,          // 延迟间隔
    enableEntrance = true,      // 启用入场动画
    enableHover = true          // 启用悬停动画
  } = options;
  
  // 返回值
  return {
    entranceProps,        // 入场动画props
    hoverProps,           // 悬停动画props
    staggerProps,         // 延迟动画props
    animationState        // 动画状态
  };
};
```

### 2. AnimatedCard 组件接口

```javascript
const AnimatedCard = ({
  children,              // 子元素
  index = 0,             // 卡片索引
  animationConfig,       // 动画配置
  className = "",        // 自定义类名
  disabled = false,      // 禁用动画
  // ...其他props
}) => {
  // 组件实现
};
```

## 动画事件处理

### 1. 动画生命周期事件

```javascript
{
  onAnimationStart: (animationType) => void,    // 动画开始
  onAnimationComplete: (animationType) => void, // 动画完成
  onAnimationError: (error) => void             // 动画错误
}
```

### 2. 错误处理数据结构

```javascript
{
  type: "ANIMATION_ERROR",    // 错误类型
  component: string,          // 组件名称
  animation: string,          // 动画类型
  error: Error,              // 错误对象
  timestamp: number          // 时间戳
}
```

## 性能监控数据结构

### 1. 动画性能指标

```javascript
{
  animationType: string,      // 动画类型
  duration: number,           // 实际时长
  fps: number,               // 帧率
  memoryUsage: number,        // 内存使用
  timestamp: number          // 时间戳
}
```

### 2. 批量动画配置

```javascript
{
  container: {
    staggerChildren: 0.05,   // 子元素延迟
    delayChildren: 0         // 初始延迟
  },
  item: {
    duration: 0.3,           // 单项时长
    ease: "easeOut"           // 缓动函数
  }
}
```

## 配置验证规则

### 1. 动画配置验证

```javascript
{
  duration: {
    type: "number",
    min: 0,
    max: 2000,
    required: true
  },
  easing: {
    type: "string", 
    enum: ["ease", "ease-in", "ease-out", "ease-in-out"],
    required: true
  },
  hoverDistance: {
    type: "number",
    min: 0,
    max: 50,
    required: false
  }
}
```

### 2. 组件属性验证

```javascript
{
  index: {
    type: "number",
    min: 0,
    required: false
  },
  disabled: {
    type: "boolean",
    required: false
  }
}
```

## 状态管理

### 1. 动画状态枚举

```javascript
const AnimationState = {
  IDLE: "idle",
  ENTERING: "entering", 
  ENTERED: "entered",
  EXITING: "exiting",
  ERROR: "error"
};
```

### 2. 动画类型枚举

```javascript
const AnimationType = {
  ENTRANCE: "entrance",
  HOVER: "hover",
  FOCUS: "focus",
  CLICK: "click"
};
```

## 数据流设计

### 1. 组件数据流

```
配置参数 → useCardAnimations Hook → 动画Props → AnimatedCard组件 → motion.div
```

### 2. 事件数据流

```
用户交互 → 事件处理 → 状态更新 → 动画触发 → 性能监控
```

## 设计原则

1. **单一职责**: 每个Hook和组件只负责一种动画类型
2. **配置化**: 支持外部配置，提高灵活性
3. **性能优化**: 使用React.memo和useMemo优化性能
4. **错误处理**: 完整的错误捕获和处理机制
5. **类型安全**: 运行时类型验证和错误检查
6. **响应式**: 支持移动端和桌面端适配
