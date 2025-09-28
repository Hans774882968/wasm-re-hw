[TOC]

## 安装及初始化

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
# 用 --here 是因为要修改已有项目
specify init --here --ai claude
```

环境：Claude Code + GLM-4.5

## constitution命令文案

这是一个帮助程序员们练习前端逆向和WASM逆向的网站。

1. 网站的样式和配色务必使用tweakcn的`quantum-rose`主题提供的CSS变量，代码位于`wasm-re-ui\src\index.css`
2. 务必优先使用shadcn的相关组件实现功能，比如Switch、Input、Button等组件。实在找不到就考虑使用`wasm-re-ui\src\components`文件夹下的组件。都找不到才考虑自定义组件

代码规范：

1. 遵循DRY原则，3次及以上重复出现的代码应抽象为函数、子组件等
2. 不要使用switch语句，用if实现
3. 使用early return、early break、early continue，减少代码嵌套层级
4. 所有有可能报错的函数调用，都需要捕获，并且`console.error`+`toast.error`

其他要求：

1. 所有文档都输出中文

## specify命令文案

每一个页面的每一个卡片元素都要加上过渡动画。页面URL切换时也要有过渡动画。动画用`motion/react`包实现

## plan命令文案

动画用`motion/react`包实现

## tasks命令文案

无。让GLM-4.5直接输出

## implement命令

最后执行`/implement`命令就行

## 常见的坑总结

1. LLM默认生成的测试框架是Jest，无视了我的项目是Vite生成的。我改成了Vitest
2. `motion/react`不是一个包，它来自`bun add motion`，但LLM不懂
3. LLM无视了我项目只使用JS的现状，说要生成带TypeScript的代码，我手动把相关语句删掉了

## 第一次执行效果

动画有很多问题。比如入场动画比较奇怪。切换页面直接所有元素都显示不出来。但是还是勉强试试修复。

## 第二次从plan命令开始执行

`/plan`命令文案：

大佬，现在代码有些问题请你帮我修复：

1. 我不希望项目出现scale动画。请把所有的scale动画都替换为`translate-y`向上移动4px的动画
2. 初始进入的页面的元素能够正常显示，但切换页面后，元素全都看不见，但又能交互。请修复切换页面的过渡动画的bug
3. 切换页面后，看到控制台报错：“不支持的动画类型 slideLeft，使用默认值 fade”这种错误有很多，值包括`slideLeft, slideRight, slideUp, slideDown`
