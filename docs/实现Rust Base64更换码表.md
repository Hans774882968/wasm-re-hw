## 通义千问网页端

大佬，你是一名专家rust工程师，精通rust最佳实践。请叫我hans7。请帮我写一段rust代码，输入一个字符串，先做输入校验，然后调用更换了码表的Base64算法编码字符串。还需要一个配套的解码算法还原字符串。并且我希望把它们编译为WASM模块。

注意：请你优先考虑使用已有的cargo包。

rust最佳实践：

- 禁止 `unwrap()/expect()`，一律返回 `Result<T, E>`
- 二进制 `main.rs` 里可以用 `anyhow::Context` 做统一错误包装，打印到日志即可
- 函数签名里出现 `<'a>` 超过 2 次→考虑新类型封装：`struct Foo<'a> { s: &'a str }`
- 别把 `'static` 当“万金油”，它只会把问题推迟到运行时
- 遵循DRY原则，3次及以上重复出现的代码应抽象为方法
- 使用early return、early break、early continue，减少代码嵌套层级

自定义错误编写规范：

1. 让自定义的错误类型与`JsValue`兼容。示例代码如下：

```rust
#[derive(Debug, Error)]
pub enum AesError {
    #[error("base64 decode failed: {0}")]
    Base64(#[from] base64::DecodeError),
    // ...
}

impl From<AesError> for JsValue {
    fn from(e: AesError) -> Self {
        JsValue::from_str(&e.to_string())
    }
}
```

这次通义千问给的代码质量不太好，经历了一些波折才改成能跑的代码。

### 单测

大佬，根据你的建议，我修改后的代码如下：

请你帮我生成单测用例。下面的单测示例代码格式供你参考：

```rust
#[test]
fn sha256_bytes_pure_basic_test() -> anyhow::Result<()> {
    let hello = b"hello world";
    let output_hello = compute_sha256_bytes(hello).to_hex();
    assert_eq!(
        output_hello,
        "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    );

    Ok(())
}
```

### 补充两个方法，支持输入自定义码表

大佬，现在我的代码`rust-wasm\src\custom_base64.rs`如下：

```rust

```

接下来请你在这个文件里帮我补充两个方法，它们在原有方法的基础上，新增一个参数，支持输入自定义码表的字符串。并请你新增这两个方法对应的测试用例。

有了能工作的完整代码作为上下文，这次通义千问给的代码没怎么改就通过单测了。

### 实现配套的前端界面（通义千问网页端，新开对话）

大佬，你是一名专家前端工程师，精通前端工程化。请叫我hans7。我有`rust-wasm\src\custom_base64.rs`，它编译生成了WASM模块，其中新增的方法如下：

```ts
/**
 * 使用自定义码表对字符串进行 Base64 编码
 */
export function encode_custom_base64(input: string): string;
/**
 * 使用自定义码表对 Base64 字符串进行解码，并还原为原始字符串
 */
export function decode_custom_base64(encoded: string): string;
/**
 * 使用运行时提供的 Base64 码表对字符串进行编码
 */
export function encode_base64_with_alphabet(input: string, alphabet: string): string;
/**
 * 使用运行时提供的 Base64 码表对字符串进行解码
 */
export function decode_base64_with_alphabet(encoded: string, alphabet: string): string;
```

现在请你帮我写配套的前端UI：

1. 调用以上方法实现字符串的加密以及解密。其中有两个表单需要输入自定义码表，有两个不需要。
2. 提供一道逆向题。用户通过前端逆向得知`encode_custom_base64`方法所使用的码表，输入并提交，我们判定结果是否正确。我的项目已有与该功能类似的组件`wasm-re-ui\src\rustWasmEncryptDemos\shaDemo\AnswerCard.jsx`供你参考，代码如下：

```jsx

```

技术栈：

1. React+Tailwind CSS
2. 组件库为shadcn
3. 图标库使用`react-icons`
4. 提示信息使用`sonner`

样式要求：

1. 使用tweakcn的`quantum-rose`主题提供的CSS变量，代码如下：

```css
/* index.css :root, .dark, @theme inline, @layer base */
```

2. 优先使用shadcn的相关组件实现功能，比如Switch、Input、Button等组件

最佳实践：

1. 遵循DRY原则，3次及以上重复出现的代码应抽象为函数、子组件等
2. 缩进为2个空格
3. 不要使用switch语句，用if实现
4. 使用early return、early break、early continue，减少代码嵌套层级
5. 使用shadcn的cn函数拼接类名。我项目的cn函数位于`@/lib/utils.js`
6. 组件声明使用普通函数而非箭头函数

写完配套方法后，请帮我写与之配套的在首页展示的介绍卡片。卡片的代码结构如下，供你参考：

```jsx
<IntroCard
  icon={<Key className="text-primary h-5 w-5" />}
  title="异或加密"
  description="使用 Rust 编译的 WASM 模块实现简单的异或加密算法。这种加密方式适合用于简单的数据混淆，但不适合高安全性场景。"
  tags={['Rust', 'WASM', '异或加密']}
  to="/xor-encrypt"
/>
```

### 前端界面修改

大佬，我把你给我的代码拆分了一下：

- `wasm-re-ui\src\rustWasmEncryptDemos\base64CustomApb\Base64CustomAlphabetDemo.jsx`
- `wasm-re-ui\src\rustWasmEncryptDemos\base64CustomApb\AnswerCardForCB.jsx`

```jsx
// Base64CustomAlphabetDemo
```

```jsx
// AnswerCardForCB
```

接下来请你帮我：

1. 把`Base64Section`组件改成左右两个表单的形式，左边的表单有“编码”按钮，右边的有“解码”按钮。
2. 把所有的Input组件都改为shadcn的Textarea组件，且展示输出结果的Textarea组件禁止输入。
3. 为所有展示输出结果的Textarea组件添加一个“复制”按钮，点击后复制内容到剪贴板。调用`wasm-re-ui\src\lib\utils.js`的`copyToClipboard(text)`函数即可。

反馈：通义千问的代码还是不合需求，再试试。

大佬，你对`Base64Section`的改动仍然不合需求！我想要的是：`Base64Section`组件分为左右两个表单。

- 对于《固定码表（预设）》，左边的表单只有字段“原始字符串”，下面是编码按钮，再下面是展示编码结果的Textarea组件。右边的表单只有字段“编码字符串”，下面是解码按钮，再下面是展示解码结果的Textarea组件。
- 对于《动态码表（运行时指定）》，左边的表单有字段“原始字符串”和“Base64 码表”，下面是编码按钮，再下面是展示编码结果的Textarea组件。右边的表单有字段“编码字符串”和“Base64 码表”，下面是解码按钮，再下面是展示解码结果的Textarea组件。

请在以下代码的基础上更改：

```jsx
// Base64Section 组件
```

反馈：这次的代码没问题了。最后让通义千问给我弄个分割线。

> 大佬，这次的代码是OK的。接下来请你帮我在`Base64Section`的两个表单之间添加分割线。注意考虑移动端适配。该分割线在移动端或PC端都需要显示。你只需要输出需要改动的代码。

反馈：发现“Base 64 码表”字段因为输入文本有64个字符而溢出。继续问。

> 大佬，你这样写对于固定码表的两个表单没问题，但对于动态码表的两个表单，因为它们有Base64 码表的Textarea，要填写64个字符，所以它会溢出盒子。请问如何解决？

反馈：它说：给所有Textarea添加`className="font-mono min-h-[80px] whitespace-pre-wrap break-all"`就行。“💡 whitespace-pre-wrap 保证用户粘贴的码表（即使是一整行）也能在容器内自动换行显示，而 break-all 确保极端情况下也能断行。”测试暂时没发现有溢出的情况。
