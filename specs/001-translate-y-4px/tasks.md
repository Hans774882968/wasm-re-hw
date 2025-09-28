# Tasks: 卡片动画效果优化

**Input**: Design documents from `/specs/001-translate-y-4px/`  
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `wasm-re-ui/src/` for frontend, `rust-wasm/` for WASM

## Phase 3.1: Setup
- [x] T001 安装motion库和vitest依赖到wasm-re-ui项目，并新增`"test": "vitest"`
- [ ] T002 创建动画相关目录结构 `wasm-re-ui/src/animations/`
- [ ] T003 [P] 创建动画样式文件 `wasm-re-ui/src/styles/animations.css`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] 创建useCardAnimations Hook的契约测试 `wasm-re-ui/tests/unit/testUseCardAnimations.js`
- [ ] T005 [P] 创建AnimatedCard组件的契约测试 `wasm-re-ui/tests/unit/testAnimatedCard.jsx`
- [ ] T006 [P] 创建动画配置验证的契约测试 `wasm-re-ui/tests/unit/testAnimationUtils.js`
- [ ] T007 [P] 创建多卡片延迟动画的集成测试 `wasm-re-ui/tests/integration/test-stagger-animations.jsx`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T008 创建动画配置工具函数 `wasm-re-ui/src/animations/animationUtils.js`
- [ ] T009 [P] 创建useCardAnimations Hook `wasm-re-ui/src/animations/useCardAnimations.js`
- [ ] T010 [P] 创建AnimatedCard组件 `wasm-re-ui/src/components/AnimatedCard.jsx`
- [ ] T011 实现动画样式和CSS变量 `wasm-re-ui/src/styles/animations.css`
- [ ] T012 添加错误处理和性能监控 `wasm-re-ui/src/animations/animationUtils.js`
- [ ] T013 创建响应式动画配置 `wasm-re-ui/src/animations/responsiveConfig.js`

## Phase 3.4: Integration
- [ ] T014 更新首页Home.jsx卡片使用AnimatedCard组件 `wasm-re-ui/src/pages/home/Home.jsx`
- [ ] T015 [P] 更新AES-CBC演示页面使用AnimatedCard组件 `wasm-re-ui/src/rustWasmEncryptDemos/AesCbcDemo.jsx`
- [ ] T016 [P] 更新Base64演示页面使用AnimatedCard组件 `wasm-re-ui/src/rustWasmEncryptDemos/base64CustomApb/AnswerCardForCB.jsx`
- [ ] T017 [P] 更新SHA演示页面使用AnimatedCard组件 `wasm-re-ui/src/rustWasmEncryptDemos/shaDemo/AnswerCard.jsx`
- [ ] T018 更新文件SHA演示页面使用AnimatedCard组件 `wasm-re-ui/src/rustWasmEncryptDemos/shaDemo/FileShaDemo.jsx`

## Phase 3.5: Polish
- [ ] T019 [P] 为动画功能编写单元测试 `wasm-re-ui/tests/unit/`
- [ ] T020 性能测试和优化（帧率、内存使用）
- [ ] T021 [P] 更新CLAUDE.md文档添加motion库信息
- [ ] T022 移除重复代码，优化动画性能
- [ ] T023 验证移动端适配和响应式设计

## Dependencies
- Tests (T004-T007) before implementation (T008-T013)
- T008 blocks T009, T012
- T009 blocks T010
- T010 blocks T014-T018
- Implementation before polish (T019-T023)

## Parallel Example
```
# Launch T004-T007 together:
Task: "创建useCardAnimations Hook的契约测试 wasm-re-ui/tests/unit/testUseCardAnimations.js"
Task: "创建AnimatedCard组件的契约测试 wasm-re-ui/tests/unit/testAnimatedCard.jsx"
Task: "创建动画配置验证的契约测试 wasm-re-ui/tests/unit/testAnimationUtils.js"
Task: "创建多卡片延迟动画的集成测试 wasm-re-ui/tests/integration/test-stagger-animations.jsx"

# Launch T015-T017 together after T014:
Task: "更新AES-CBC演示页面使用AnimatedCard组件 wasm-re-ui/src/rustWasmEncryptDemos/AesCbcDemo.jsx"
Task: "更新Base64演示页面使用AnimatedCard组件 wasm-re-ui/src/rustWasmEncryptDemos/base64CustomApb/AnswerCardForCB.jsx"
Task: "更新SHA演示页面使用AnimatedCard组件 wasm-re-ui/src/rustWasmEncryptDemos/shaDemo/AnswerCard.jsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - animation-api.md → contract test tasks [P] (T004-T007)
   - API endpoints → component implementation tasks (T009-T010)
   
2. **From Data Model**:
   - Animation config entity → utility functions (T008)
   - Component state → Hook implementation (T009)
   
3. **From User Stories**:
   - Each page integration → integration tasks (T014-T018)
   - Performance requirements → performance tests (T020)
   
4. **Ordering**:
   - Setup → Tests → Core → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
