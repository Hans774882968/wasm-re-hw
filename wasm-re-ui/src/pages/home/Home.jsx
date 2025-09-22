import { Shield, Code, Key, HashIcon } from 'lucide-react';
import { IntroCard } from './IntroCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">WASM 加密演示平台</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            探索使用 WebAssembly 实现的各种加密算法，包括异或加密和 AES-CBC 加密。
            本平台目前展示了 Rust 编译为 WASM 后在前端的应用。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <IntroCard
            icon={<Key className="text-primary h-5 w-5" />}
            title="Rust 异或加密"
            description="使用 Rust 编译的 WASM 模块实现简单的异或加密算法。这种加密方式适合用于简单的数据混淆，但不适合高安全性场景。"
            tags={['Rust', 'WASM', '异或加密']}
            to="/xor-encrypt"
          />

          <IntroCard
            icon={<Shield className="text-primary h-5 w-5" />}
            title="Rust AES-CBC 加密"
            description="使用 Rust 编译的 WASM 模块实现 AES-CBC 加密算法。这是一种对称加密算法，广泛用于数据加密和保护。"
            tags={['Rust', 'WASM', 'AES-CBC']}
            to="/aes-cbc"
          />

          <IntroCard
            icon={<HashIcon className="text-primary h-5 w-5" />}
            title="Rust SHA256 / 512 演示"
            description="使用 Rust 编译的 WASM 模块实现高速安全的 SHA256 和 SHA512 哈希计算，支持加盐增强安全性。适用于密码处理、数据指纹等场景。"
            tags={['Rust', 'WASM', 'SHA256', 'SHA512', '加盐哈希']}
            problemTags={['逆向题', '简单']}
            to="/sha-demo"
          />
        </div>

        {/* 未来计划部分 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">未来计划</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-bold">SHA-256 哈希</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                使用 Rust 实现 SHA-256 哈希算法，生成字符串摘要。
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-bold">多语言 WASM</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                引入 Go、C++、Python 等语言编译的 WASM 模块。
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-bold">前端逆向靶场</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                模拟付费软件验证，提供前端逆向练习环境。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
