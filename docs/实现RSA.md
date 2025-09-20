## Kimi K2 网页端

大佬，你是一名专家rust工程师，精通rust最佳实践。请叫我hans7。请帮我写一段rust代码，用AES CBC模式加密字符串，并输出其base64结果。以及输入base64字符串，输出AES解密后的结果。并且我希望它们能编译为WASM模块。我现在已经有一个cargo项目，rust-wasm\src\lib.rs代码如下，供你参考：

我希望AES加密和解密的功能放在另一个文件。

rust最佳实践：

- 禁止 `unwrap()/expect()`，一律返回 `Result<T, E>`
- 二进制 `main.rs` 里可以用 `anyhow::Context` 做统一错误包装，打印到日志即可
- 函数签名里出现 `<'a>` 超过 2 次→考虑新类型封装：`struct Foo<'a> { s: &'a str }`
- 别把 `'static` 当“万金油”，它只会把问题推迟到运行时
- 遵循DRY原则，3次及以上重复出现的代码应抽象为方法
- 使用early return、early break、early continue，减少代码嵌套层级

---

Kimi生成的代码加密时有Padding error，问了它怎么修，它确实找到了正确的解决方案：

> 「明文缓冲区长度给错」。`encrypt_padded_mut::<Pkcs7>` 要求传入 「至少 `plain.len() + 16` 字节的可变缓冲区」，而你只传了 `plain.as_bytes().to_vec()`（长度刚好等于明文），内部一写就越界，于是 cipher 直接返回 PadError。

### 实现配套的前端界面

大佬，我现在的代码rust-wasm\src\aes_cbc.rs如下，它已经能正常工作。

配套的rust-wasm\src\error.rs如下：

现在请你帮我写一个前端UI，调用以上AES的WASM模块。已有一个组件代码如下，供你参考：

（`wasm-re-ui\src\rustWasmEncryptDemos\RustWasmEncryptDemo.jsx`代码）
