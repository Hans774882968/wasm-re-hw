[TOC]

# wasm逆向练习网页开发，附rust入门教程

## 引言

今天心血来潮，开一个新的开源项目来编写一些wasm加密实例。

## rust入门

我从没学过rust，需要从头开始。

### 安装rustup

TODO

### 初始化rust项目

```bash
cargo new --lib rust-wasm
```

可以看到项目会自动初始化git仓库。但在我们这个项目不需要这个特性，因为我们打算把前端项目和rust项目放在同一个GitHub仓库中。所以我手动删除了`rust-wasm`文件夹下的`.git`文件夹。

### 安装依赖

安装`wasm-pack`：`cargo install wasm-pack`

安装项目依赖：

```bash
cargo add wasm_bindgen base64
```

## 部署到GitHub Pages

我是直接参考我之前[博客的《【常规】部署到 GitHub Pages》](https://www.52pojie.cn/thread-2048343-1-1.html)一节来操作的。这次编写workflow（[完整代码传送门](https://github.com/Hans774882968/wasm-re-hw/blob/main/.github/workflows/main.yml)）学到的新知识：

1. 每一步 `run:` 默认都在 **仓库根目录** 开始
2. 用 `working-directory` 显式指定子目录，避免手动 `cd` 把路径弄乱
3. Deploy也同理。所以需要修改`publish_dir: ./dist`为`publish_dir: ./wasm-re-ui/dist`

## 参考资料

1. 参考我之前博客《【常规】部署到 GitHub Pages》一节：https://www.52pojie.cn/thread-2048343-1-1.html

