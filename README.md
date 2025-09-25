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

编译生成WASM文件：

```bash
wasm-pack build --target web --out-dir ../wasm-re-ui/src/wasm
```

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

### 用Web Worker解决文件哈希过程中的卡顿问题

实测发现，我在[Rust 文件 SHA 哈希演示](https://hans774882968.github.io/wasm-re-hw/file-sha-hash-demo)这个页面执行大文件哈希时，页面会卡顿。这因为文件哈希计算调用的WASM是在主线程中执行的。经过一番调研，我决定引入Web Worker来解决。实测发现，引入Web Worker后，页面确实完全不卡了。

新增Worker文件[`wasm-re-ui\src\rustWasmEncryptDemos\fileShaWorker.worker.js`](https://github.com/Hans774882968/wasm-re-hw/blob/main/wasm-re-ui/src/rustWasmEncryptDemos/fileShaWorker.worker.js)：

```js
/**
 * 这里能直接用 ESM 是因为我们：在 vite.config.js 里
 * 1. 配置了 worker: { format: 'es' }
 * 2. `new Worker`时传入了`type: 'module'`：
 * const fileShaWorker = new Worker(new URL('./fileShaWorker.worker.js', import.meta.url), { type: 'module' });
 */
import init, {
  get_bytes_sha256,
  get_bytes_sha256_pure,
  get_bytes_sha256_with_salt,
  get_bytes_sha512,
  get_bytes_sha512_pure,
  get_bytes_sha512_with_salt,
} from '@/wasm/rust_wasm';

let wasmInitialized = false;

async function initRustWasm() {
  if (wasmInitialized) {
    return;
  }
  try {
    await init();
    wasmInitialized = true;
  } catch (err) {
    console.error('Rust WASM 初始化失败', err);
  }
}

self.onmessage = async function (e) {
  const { id, type, data, salt } = e.data;

  try {
    await initRustWasm();

    let result;

    if (type === 'sha256-pure') {
      result = get_bytes_sha256_pure(data);
    } else if (type === 'sha512-pure') {
      result = get_bytes_sha512_pure(data);
    } else if (type === 'sha256-default-salt') {
      result = get_bytes_sha256(data);
    } else if (type === 'sha512-default-salt') {
      result = get_bytes_sha512(data);
    } else if (type === 'sha256-salt') {
      result = get_bytes_sha256_with_salt(data, salt);
    } else if (type === 'sha512-salt') {
      result = get_bytes_sha512_with_salt(data, salt);
    } else {
      throw new Error(`Unknown hash type: ${type}`);
    }

    self.postMessage({
      id,
      type,
      result,
      status: 'success',
    });
  } catch (err) {
    self.postMessage({
      id,
      type,
      error: err.message || '计算失败',
      status: 'error',
    });
  }
};
```

然后是对原有页面`wasm-re-ui\src\rustWasmEncryptDemos\FileShaDemo.jsx`的改动：

1. 我们延迟到点击计算按钮，调用`handleFileShaHash`时再`new Worker`+初始化WASM
2. `new Worker`时记得传入`type: 'module'`，并在`vite.config.js`里新增配置：`worker: {format: 'es'}`
3. 直接把`fileShaWorker.onmessage = (e) => {}`写进`handleFileShaHash`里是OK的，但这样写的话会遇到一个闭包问题：这个`onmessage`捕捉到的所有state都是初始值。但我想要的是最新的state值。为此，我们不得不在一个setState中拿。相关代码如下：

```js
setCompletedCount((prevCount) => {
  const newCount = prevCount + 1;
  if (newCount === totalShaMethodTypes) {
    toast.success('SHA 哈希计算完成', {
      description: `${file.name} 计算完成`,
    });
    setIsProcessing(false);
  }
  return newCount;
});
```

这样写很糟糕，但代码也能跑，暂时先这样吧。这里的`completedCount`变量是用来优化用户体验的，在输入大文件时，用户可以在界面看到算好的哈希数目，缓解焦虑。

本章节剩余部分是讲我的试错过程，不感兴趣的可跳过~这个试错过程还是有点曲折的。已知通义千问初始给出的写法不对，并且问它改，它也没能力改对。所以只能靠古法手作把每种可能性都试一遍。我个人觉得过程中最有意思的尝试是[`useWorker`](https://www.npmjs.com/package/@koale/useworker)。

初次听说这个包，我就想，如果能跑通这个方案，那就不用写额外的`new Worker`了，挺优雅的。二话不说，开工！安装：`bun add @koale/useworker`。使用：[官方文档](https://useworker.js.org/docs/usage)给的例子足够清晰了。但我发现，`get_bytes_sha256_pure`等都不是纯函数，而`useWorker(fn)`要求`fn`是纯函数。

```js
export function get_bytes_sha256_pure(data) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.get_bytes_sha256_pure(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}
```

那我就想，能不能把它们变成纯函数？于是我尝试了：

1. 把`wasm`作为参数传入
2. 把`get_bytes_sha256_pure`等函数作为参数传入

可惜Worker不支持克隆这两种类型的变量。于是这个方案彻底破产了。

## 部署到GitHub Pages

我是直接参考我之前[博客的《【常规】部署到 GitHub Pages》](https://www.52pojie.cn/thread-2048343-1-1.html)一节来操作的。这次编写workflow（[完整代码传送门](https://github.com/Hans774882968/wasm-re-hw/blob/main/.github/workflows/main.yml)）学到的新知识：

1. 每一步 `run:` 默认都在 **仓库根目录** 开始
2. 用 `working-directory` 显式指定子目录，避免手动 `cd` 把路径弄乱
3. Deploy也同理。所以需要修改`publish_dir: ./dist`为`publish_dir: ./wasm-re-ui/dist`

## 参考资料

1. 参考我之前博客《【常规】部署到 GitHub Pages》一节：https://www.52pojie.cn/thread-2048343-1-1.html

