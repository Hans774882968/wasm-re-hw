# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个帮助程序员们练习前端逆向和WASM逆向的逆向工程学习平台，包含多种加密算法实现和对应的 Web 前端界面，部分前端界面提供了逆向题。项目包含两个主要模块：

- `rust-wasm/`: Rust WASM 库，实现各种加密算法
- `wasm-re-ui/`: React 前端应用，提供交互式演示界面

## 开发命令

### Rust WASM 开发

```bash
# 进入 rust-wasm 目录
cd rust-wasm

# 编译生成 WASM 文件
wasm-pack build --target web --out-dir ../wasm-re-ui/src/wasm

# 运行 Rust 测试
cargo test

# 添加依赖
cargo add <package_name>
```

### 前端开发

```bash
# 进入前端目录
cd wasm-re-ui

# 安装依赖
bun install

# 安装新的依赖
bun add <package_name>

# 启动开发服务器
bun dev

# 单元测试
bun run test

# 构建生产版本
bun run build

# 代码检查及修复
bun lint --fix

# 预览构建结果
bun run preview
```

## 项目架构

### Rust WASM 库结构

- `src/lib.rs`: 主要的 WASM 导出函数
- `src/aes_cbc.rs`: AES-CBC 加密实现
- `src/custom_base64.rs`: 自定义 Base64 码表实现
- `src/xor_demo.rs`: XOR 加密演示
- `src/sha_demo/`: SHA 哈希相关实现
  - `sha_demo.rs`: 主要 SHA 函数
  - `sha_bytes_demo.rs`: 字节数组 SHA 处理，用于和前端对接，计算任意文件的 SHA 哈希
  - `utils.rs`: 工具函数

### 前端应用结构

- `src/App.jsx`: 主应用组件
- `src/pages/home/`: 首页组件
- `src/rustWasmEncryptDemos/`: 加密演示组件
  - `AesCbcDemo.jsx`: AES-CBC 演示
  - `base64CustomApb/`: 自定义 Base64 演示
  - `shaDemo/`: SHA 哈希演示
    - `ShaDemo.jsx`: 字符串 SHA 哈希（使用 Web Worker）
    - `FileShaDemo.jsx`: 任意文件 SHA 哈希（使用 Web Worker）
    - `fileShaWorker.worker.js`: 用 Web Worker 实现性能优化
- `src/components/`: 通用组件
  - `AnimatedCard.jsx`: 动画卡片组件（使用 motion 库）
  - `ui/`: shadcn UI 组件
- `src/animations/`: 动画相关功能
  - `animationUtils.js`: 动画工具函数（验证、配置、性能监控）
  - `useCardAnimations.js`: 卡片动画 Hook
  - `responsiveConfig.js`: 响应式动画配置
- `src/styles/`: 样式文件
  - `animations.css`: 动画样式和 CSS 变量

## 关键技术特性

### WASM 错误处理
在 WASM 环境中避免使用 `unwrap()`，因为 panic 会终止整个 WebAssembly 实例。使用 `Result<T, E>` 和自定义错误类型。

### Web Worker 使用
对于大文件处理（如文件哈希计算），使用 Web Worker 避免主线程卡顿：
- Worker 配置在 `vite.config.js` 中设置 `worker: { format: 'es' }`
- 创建 Worker 时使用 `{ type: 'module' }` 参数

### 动画系统
项目使用 `motion` 库实现卡片动画效果：
- **安装**: `bun add motion`
- **导入**: `import { motion } from 'motion/react'`
- **AnimatedCard 组件**: 提供统一的卡片动画功能，位于 `src/components/AnimatedCard.jsx`
- **动画配置**:
  - 入场动画: 300ms 持续时间，ease 缓动，fade-in + slide from bottom 效果
  - 悬停动画: translateY -4px，200ms 持续时间，ease 缓动
  - 多卡片延迟: 50ms 间隔顺序出现
  - 禁用 scale 动画，只使用 transform
- **响应式设计**: 支持移动端适配和用户偏好（prefers-reduced-motion）
- **动画钩子**: `useCardAnimations` 提供动画状态管理和性能监控
- **工具函数**: `animationUtils.js` 提供配置验证、错误处理和性能优化
- **响应式配置**: `responsiveConfig.js` 根据设备类型自动优化动画参数
  - 移动端: 减少动画时长和移动距离
  - 平板端: 平衡性能和视觉效果
  - 桌面端: 完整动画效果
  - 低性能设备: 简化动画以提升性能
  - 支持用户偏好设置（减少动画）
- **便捷组件**: 
  - `AnimatedCardGroup`: 管理一组卡片的延迟动画
  - `AnimatedCardList`: 渲染数据列表为动画卡片
  - `AnimatedCardGrid`: 创建响应式的动画卡片网格

### 路径别名
- `@/` 指向 `src/` 目录（配置在 `vite.config.js`）

### 部署配置
项目支持 GitHub Pages 部署，相关配置：
- `VITE_DEPLOY_TARGET=github-pages` 环境变量
- 自动处理 base path 和 404 页面
