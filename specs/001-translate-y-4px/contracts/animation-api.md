# 卡片动画API契约

**版本**: 1.0.0  
**日期**: 2025-09-28

## 1. useCardAnimations Hook API

### 接口定义

```javascript
/**
 * 卡片动画Hook
 * @param {Object} options - 动画配置选项
 * @param {number} [options.entranceDuration=300] - 入场动画时长(ms)
 * @param {number} [options.hoverDuration=200] - 悬停动画时长(ms) 
 * @param {number} [options.hoverDistance=4] - 悬停距离(px)
 * @param {number} [options.staggerDelay=50] - 卡片间延迟(ms)
 * @param {boolean} [options.enableEntrance=true] - 启用入场动画
 * @param {boolean} [options.enableHover=true] - 启用悬停动画
 * @returns {Object} 动画Props和状态
 */
const useCardAnimations = (options) => {
  // 实现
};
```

### 返回值契约

```javascript
{
  // 入场动画Props
  entranceProps: {
    initial: Object,      // 初始状态 {opacity, y}
    animate: Object,      // 目标状态 {opacity, y}  
    transition: Object,   // 过渡配置 {duration, ease}
    onAnimationStart: Function,  // 动画开始回调
    onAnimationComplete: Function // 动画完成回调
  },
  
  // 悬停动画Props
  hoverProps: {
    whileHover: Object,   // 悬停状态 {y}
    transition: Object    // 过渡配置 {duration, ease}
  },
  
  // 延迟动画Props
  staggerProps: {
    initial: Object,      // 初始延迟状态
    animate: Object,      // 目标延迟状态
    transition: Object    // 延迟过渡配置
  },
  
  // 动画状态
  animationState: {
    isEntering: boolean, // 是否正在入场
    isEntered: boolean,  // 是否已完成入场
    isHovered: boolean,  // 是否悬停
    error: Error|null    // 错误信息
  }
}
```

## 2. AnimatedCard 组件 API

### 组件接口

```javascript
/**
 * 动画卡片组件
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 子元素
 * @param {number} [props.index=0] - 卡片索引
 * @param {Object} [props.animationConfig] - 自定义动画配置
 * @param {string} [props.className=""] - 自定义类名
 * @param {boolean} [props.disabled=false] - 禁用动画
 * @param {Function} [props.onAnimationStart] - 动画开始回调
 * @param {Function} [props.onAnimationComplete] - 动画完成回调
 * @param {Function} [props.onError] - 错误回调
 */
const AnimatedCard = (props) => {
  // 实现
};
```

### 属性验证契约

```javascript
AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number,
  animationConfig: PropTypes.shape({
    entrance: PropTypes.shape({
      duration: PropTypes.number,
      easing: PropTypes.string
    }),
    hover: PropTypes.shape({
      duration: PropTypes.number,
      distance: PropTypes.number
    })
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onAnimationStart: PropTypes.func,
  onAnimationComplete: PropTypes.func,
  onError: PropTypes.func
};

AnimatedCard.defaultProps = {
  index: 0,
  className: "",
  disabled: false
};
```

## 3. 动画配置契约

### 默认配置

```javascript
const DEFAULT_ANIMATION_CONFIG = {
  entrance: {
    duration: 300,
    easing: "ease",
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  hover: {
    duration: 200,
    easing: "ease",
    distance: 4
  },
  stagger: {
    delay: 50
  }
};
```

### 配置验证

```javascript
/**
 * 验证动画配置
 * @param {Object} config - 待验证配置
 * @returns {Object} {isValid: boolean, errors: Array}
 */
const validateAnimationConfig = (config) => {
  const errors = [];
  
  // 验证入场动画配置
  if (config.entrance) {
    if (typeof config.entrance.duration !== 'number' || config.entrance.duration < 0) {
      errors.push('entrance.duration must be a positive number');
    }
    if (typeof config.entrance.easing !== 'string') {
      errors.push('entrance.easing must be a string');
    }
  }
  
  // 验证悬停动画配置
  if (config.hover) {
    if (typeof config.hover.duration !== 'number' || config.hover.duration < 0) {
      errors.push('hover.duration must be a positive number');
    }
    if (typeof config.hover.distance !== 'number') {
      errors.push('hover.distance must be a number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 4. 事件处理契约

### 事件类型定义

```javascript
const AnimationEventTypes = {
  START: 'animation_start',
  COMPLETE: 'animation_complete',
  ERROR: 'animation_error'
};

/**
 * 动画事件回调格式
 * @callback AnimationEventCallback
 * @param {Object} event - 事件对象
 * @param {string} event.type - 事件类型
 * @param {string} event.animation - 动画类型
 * @param {number} event.timestamp - 时间戳
 * @param {*} [event.data] - 附加数据
 */
```

### 错误处理契约

```javascript
/**
 * 动画错误对象
 * @typedef {Object} AnimationError
 * @property {string} type - 错误类型
 * @property {string} component - 组件名称
 * @property {string} animation - 动画类型
 * @property {Error} error - 原始错误对象
 * @property {number} timestamp - 时间戳
 */

/**
 * 错误回调格式
 * @callback ErrorCallback
 * @param {AnimationError} error - 错误对象
 */
```

## 5. 性能监控契约

### 性能指标收集

```javascript
/**
 * 性能指标对象
 * @typedef {Object} PerformanceMetrics
 * @property {string} animationType - 动画类型
 * @property {number} duration - 实际时长(ms)
 * @property {number} fps - 平均帧率
 * @property {number} memoryUsage - 内存使用量(MB)
 * @property {number} timestamp - 时间戳
 */

/**
 * 性能监控回调
 * @callback PerformanceCallback
 * @param {PerformanceMetrics} metrics - 性能指标
 */
```

## 6. 集成测试契约

### 测试用例模板

```javascript
import { describe, it, expect } from 'vitest';

describe('useCardAnimations', () => {
  it('应该返回正确的入场动画Props', () => {
    const { entranceProps } = useCardAnimations();
    expect(entranceProps).toBeDefined();
    expect(entranceProps.initial).toEqual({ opacity: 0, y: 20 });
    expect(entranceProps.animate).toEqual({ opacity: 1, y: 0 });
  });
  
  it('应该返回正确的悬停动画Props', () => {
    const { hoverProps } = useCardAnimations();
    expect(hoverProps).toBeDefined();
    expect(hoverProps.whileHover).toEqual({ y: -4 });
  });
});

describe('AnimatedCard', () => {
  it('应该渲染子元素', () => {
    const { getByText } = render(
      <AnimatedCard>Test Content</AnimatedCard>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });
  
  it('应该应用动画效果', () => {
    const { container } = render(
      <AnimatedCard index={0}>Test</AnimatedCard>
    );
    const motionElement = container.firstChild;
    expect(motionElement).toHaveStyle({ opacity: 0 });
  });
});
```

## 7. 版本兼容性

### 浏览器支持

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

### 依赖版本

- motion: ^10.16.0+
- React: ^18.0.0+
- React DOM: ^18.0.0+

## 8. 安全考虑

### 输入验证

- 所有数值参数必须进行范围验证
- 字符串参数必须进行白名单验证
- 对象参数必须进行结构验证

### 错误边界

- 组件必须包含错误边界处理
- 动画错误不能影响整个应用
- 必须提供优雅的降级方案

### 性能保护

- 限制同时执行的动画数量
- 提供动画禁用选项
- 监控内存使用和帧率
