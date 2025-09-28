<!-- Sync Impact Report -->
<!-- Version change: N/A → 1.0.0 -->
<!-- Modified principles: N/A (initial constitution) -->
<!-- Added sections: Core Principles, Development Standards, Technical Requirements, Governance -->
<!-- Removed sections: N/A -->
<!-- Templates requiring updates: ✅ All templates are new -->
<!-- Follow-up TODOs: N/A -->

# WASM逆向工程学习平台 Constitution

## Core Principles

### I. 样式规范优先

1. 网站的样式和配色务必使用tweakcn的`quantum-rose`主题提供的CSS变量，代码位于`wasm-re-ui\src\index.css`
2. 务必优先使用shadcn的相关组件实现功能，比如Switch、Input、Button等组件。实在找不到才考虑使用`wasm-re-ui\src\components`文件夹下的组件。都找不到才考虑自定义组件

### II. 代码质量原则

1. 遵循DRY原则，3次及以上重复出现的代码应抽象为函数、子组件等
2. 不要使用switch语句，用if实现
3. 使用early return、early break、early continue，减少代码嵌套层级
4. 所有有可能报错的函数调用，都需要捕获，并且`console.error`+`toast.error`。

### III. 错误处理标准
所有可能产生错误的函数调用必须进行错误捕获。捕获后必须同时使用`console.error`进行日志记录和`toast.error`进行用户提示。这是不可协商的开发标准。

### IV. 技术栈约束
本项目只使用JavaScript，不使用TypeScript。所有的开发必须遵循JavaScript语法规范，不得引入TypeScript相关的依赖或配置。

### V. 移动端适配
所有组件必须考虑移动端适配，使用Tailwind CSS实现响应式设计。确保在各种屏幕尺寸下的用户体验一致。

### VI. 文档规范
所有文档都务必用中文书写，包括代码注释、README文件、API文档等。这是项目的基本要求。

## Development Standards

### 代码组织规范
- 组件化开发，确保每个组件职责单一
- 遵循现有项目结构，在相应目录下开发
- 使用约定的命名规范和文件组织方式

### 代码审查要求
- 所有代码必须遵循宪法中的核心原则
- 审查时重点检查样式规范、错误处理、代码质量
- 确保移动端适配和中文文档规范

### 测试要求
- 所有功能必须有对应的测试用例
- 测试覆盖率必须达到项目要求
- 测试代码同样需要遵循宪法规范

## Technical Requirements

### 样式技术栈
- CSS变量：使用quantum-rose主题
- 组件库：shadcn优先，自定义组件次之
- 响应式：Tailwind CSS
- 样式文件位置：`wasm-re-ui\src\index.css`

### 开发技术栈
- 语言：JavaScript (禁止TypeScript)
- 框架：React
- 单元测试：Vitest
- 构建工具：Vite
- 包管理：bun

### 错误处理技术栈
- 日志：console.error
- 用户提示：toast.error
- 错误边界：React Error Boundary

## Governance

### 宪法优先原则
本宪法是项目的最高规范，所有开发活动必须遵守。宪法中的所有原则都是不可协商的，除非通过正式的修改流程。

### 修改流程
- 宪法修改需要提交正式的修改提案
- 提案必须包含详细的修改理由和影响分析
- 修改需要通过项目维护者的审核
- 修改后需要更新版本号和相关文档

### 合规性检查
- 所有代码提交都会自动检查宪法合规性
- 违反宪法原则的代码将被拒绝合并
- 定期进行项目宪法合规性审查

### 版本管理
- 使用语义化版本控制 (MAJOR.MINOR.PATCH)
- MAJOR版本：重大架构变更或原则性修改
- MINOR版本：新增原则或重要功能扩展
- PATCH版本：修复和小的改进

**Version**: 1.0.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-09-28
