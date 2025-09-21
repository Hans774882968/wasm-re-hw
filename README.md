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

## rust WASM开发

`unwrap()`在 WASM 中的危害：

1. 在 WASM 环境中，panic 会终止整个 WebAssembly 实例，导致页面崩溃
2. JavaScript 无法捕获 Rust 的 panic（除非特殊配置），用户看到的是白屏或错误提示
3. 错误信息 `InvalidByte(7, 61)` 表明 Base64 解码失败（`=` 是 Base64 填充字符，但位置错误）

## rust WASM单测

https://github.com/drager/wasm-pack/blob/master/tests/all/download.rs

```rs
fn downloading_prebuilt_wasm_bindgen_handles_http_errors() {
    let dir = tempfile::TempDir::new().unwrap();
    let bad_version = "0.2.95-some-trailing-version-stuff-that-does-not-exist";
    let cache = binary_install::Cache::at(dir.path());
    let result = install::download_prebuilt(&Tool::WasmBindgen, &cache, bad_version, true);
    assert!(result.is_err());
    let error = result.err().unwrap();

    assert!(error.chain().any(|e| e.to_string().contains("404")));
    assert!(error.chain().any(|e| e.to_string().contains(bad_version)));
}
```

盲猜这么写单测也凑合。

## 实现AES加密和解密

安装依赖：

```bash
cargo add aes cbc thiserror anyhow
```

### 关于`cipher`变量的疑问

kimi生成了这样的代码：

```rust
if !matches!(key.len(), 16 | 24 | 32) {
    return Err(AesError::BadKeyLen(key.len()));
}
// ...
let cipher = match key.len() {
    16 => Aes128CbcDec::new_from_slices(key, iv).map_err(|_| AesError::BadKeyLen(key.len()))?,
    _ => unreachable!("key len already checked"),
};
```

我问它：明明已经判断过`key`的长度，为什么要这么写。它说假如这个方法实现AES-192和AES-256，这样写比较符合开闭原则。但我个人会直接实现不同的方法来做192和256，所以果断把这段代码简化了。

## 前端建设相关

### 如何引入开源字体

我们使用的shadcn样式风格是`quantum rose`，它对应的字体都是开源的，可以直接通过fontsource安装：

```bash
bun add @fontsource/poppins @fontsource/playfair-display @fontsource/space-mono @fontsource/quicksand
```

然后可以在`wasm-re-ui\src\main.jsx`（或其他React组件，表示按需引入）或`wasm-re-ui\src\index.css`全局引入。这里我选择了后者：

```css
@import "@fontsource/poppins";
@import "@fontsource/playfair-display";
@import "@fontsource/space-mono";
@import "@fontsource/quicksand";
```

## 部署到GitHub Pages

我是直接参考我之前[博客的《【常规】部署到 GitHub Pages》](https://www.52pojie.cn/thread-2048343-1-1.html)一节来操作的。这次编写workflow（[完整代码传送门](https://github.com/Hans774882968/wasm-re-hw/blob/main/.github/workflows/main.yml)）学到的新知识：

1. 每一步 `run:` 默认都在 **仓库根目录** 开始
2. 用 `working-directory` 显式指定子目录，避免手动 `cd` 把路径弄乱
3. Deploy也同理。所以需要修改`publish_dir: ./dist`为`publish_dir: ./wasm-re-ui/dist`

## 参考资料

1. 参考我之前博客《【常规】部署到 GitHub Pages》一节：https://www.52pojie.cn/thread-2048343-1-1.html

