[TOC]

## 引言

我第一次尝鲜spec-kit，可能是模型水平太菜，也可能是我提示词提到要做“过渡页面的动画”，导致`docs\spec-kit尝鲜（废弃）.md`最终成了试错记录，白白浪费一大堆token。不过我们也看到了很多spec-kit可能踩到的坑，打算重新执行一遍，看看能不能成功。

在重新执行之前，记得把自动新建的git分支和specs文件夹删掉。

## 安装及初始化

Claude Code小技巧：

1. 执行`/init`时，可以提一嘴，让LLM输出中文文档
2. 输入命令时，按tab可快速补全

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
# 用 --here 是因为要修改已有项目
specify init --here --ai claude
```

环境：Claude Code + GLM-4.5

## constitution命令文案

这是一个帮助程序员们练习前端逆向和WASM逆向的网站。

样式规范：

1. 网站的样式和配色务必使用tweakcn的`quantum-rose`主题提供的CSS变量，代码位于`wasm-re-ui\src\index.css`
2. 务必优先使用shadcn的相关组件实现功能，比如Switch、Input、Button等组件。实在找不到就考虑使用`wasm-re-ui\src\components`文件夹下的组件。都找不到才考虑自定义组件
3. 务必考虑移动端适配，用Tailwind CSS实现

代码规范：

1. 遵循DRY原则，3次及以上重复出现的代码应抽象为函数、子组件等
2. 不要使用switch语句，用if实现
3. 使用early return、early break、early continue，减少代码嵌套层级
4. 所有有可能报错的函数调用，都需要捕获，并且`console.error`+`toast.error`

其他要求：

1. 本项目只使用JS，不使用TypeScript
2. 所有文档都务必用中文书写

## specify命令文案

我希望为每一个页面的每一个卡片元素都加上入场动画。且当鼠标悬停到元素上时，各卡片元素有`translate-y`向上移动4px的动画效果。

要求：

1. 项目不得出现scale动画
2. 请用中文写文档

### specify出现了不明确的点

执行`/clarify`命令，并附加“请用中文写文档”。

- Q：图片入场动画的持续时间应该设置为多少毫秒才能提供良好的用户体验？回答：300ms - 快速响应，适合现代Web应用
- Q：鼠标悬停时卡片向上移动4px的动画持续时间应该设置为多少毫秒？回答：200ms - 平滑过渡，标准Web交互
- Q：卡片入场动画应该使用什么效果来实现？回答：淡入+从下方滑入 - 同时使用透明度和位移效果
- Q：所有动画应该使用什么样的缓动函数来实现平滑效果？

选项：

| 选项    | 描述                                                 |
|-------|----------------------------------------------------|
| A     | ease - 标准缓动，开始和结束时慢，中间快                            |
| B     | ease-in-out - 开始和结束时慢，中间快，比ease更明显                 |
| C     | ease-out - 开始快，结束时慢，适合进入动画                         |
| D     | cubic-bezier(0.4, 0, 0.2, 1) - Material Design标准曲线 |
| Short | 提供其他缓动函数 (≤5个词)                                    |

我选A。

- Q：当页面包含多个卡片时，入场动画应该如何处理？

| 选项    | 描述                             |
|-------|--------------------------------|
| A     | 同时出现 - 所有卡片同时开始动画              |
| B     | 顺序延迟 - 卡片按顺序依次出现，每个间隔50ms      |
| C     | 分批出现 - 每批2-3个卡片同时出现，批次间间隔100ms |
| D     | 随机延迟 - 卡片在0-200ms内随机时间开始动画     |
| Short | 提供其他方式 (≤5个词)                  |

我选B。

## plan命令文案

动画用`motion`包实现。安装：`bun add motion`。导入：`import { motion } from 'motion/react'`

请用中文写文档

## tasks命令文案

请用中文写文档

## 这次执行居然完全没提到测试框架的问题

我有点担心模型用Jest，于是我手动给文档加了关于Vitest的信息。实测发现，我的努力p用没有，最后还是手动加上的。

## implement命令

执行`/implement`命令时，同样加上“请用中文写文档”

## 常见的坑总结

1. LLM默认生成的测试框架是Jest，无视了我的项目是Vite生成的。我改成了Vitest
2. `motion/react`不是一个包，它来自`bun add motion`，但LLM不懂
3. LLM无视了我项目只使用JS的现状，说要生成带TypeScript的代码，我手动把相关语句删掉了

## 第一次执行效果

这次效果比上次还烂，烂得无法形容！可能是auto compact或者GLM降智导致的？新开会话再试一次！于是我关掉Claude Code，新开会话，又试一次。这次更烂……可能是因为我短时间用掉太多GLM的token导致的。于是我决定临时换成kimi k2，最后再试一次。

换用kimi k2，发现烧了40多万token，但是连一个测试文件都无法输出。重新执行了一次，这次的花费：`6.2m input, 41.7k output`，终于输出了完整结果。但是这个结果也是比较糟糕。放弃了，以后还是用网页版来做这种需求了。对于不够强大的模型，坚决拒绝TDD！
