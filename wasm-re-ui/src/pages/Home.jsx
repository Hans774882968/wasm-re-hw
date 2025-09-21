import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, Code, Key } from 'lucide-react';

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
          <div className={cn(
            'bg-card rounded-xl shadow-lg border border-border overflow-hidden',
            'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'
          )}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">异或加密</h2>
              </div>

              <p className="text-muted-foreground mb-6">
                使用 Rust 编译的 WASM 模块实现简单的异或加密算法。
                这种加密方式适合用于简单的数据混淆，但不适合高安全性场景。
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">Rust</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">WASM</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">异或加密</span>
              </div>

              <Link
                to="/xor-encrypt"
                className={cn(
                  'inline-flex items-center justify-center w-full',
                  'bg-primary text-primary-foreground py-2 px-4 rounded-md',
                  'transition-colors duration-200 hover:bg-primary/90'
                )}
              >
                查看演示
              </Link>
            </div>
          </div>

          <div className={cn(
            'bg-card rounded-xl shadow-lg border border-border overflow-hidden',
            'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'
          )}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Rust AES-CBC 加密</h2>
              </div>

              <p className="text-muted-foreground mb-6">
                使用 Rust 编译的 WASM 模块实现 AES-CBC 加密算法。
                这是一种对称加密算法，广泛用于数据加密和保护。
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">Rust</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">WASM</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">AES-CBC</span>
              </div>

              <Link
                to="/aes-cbc"
                className={cn(
                  'inline-flex items-center justify-center w-full',
                  'bg-primary text-primary-foreground py-2 px-4 rounded-md',
                  'transition-colors duration-200 hover:bg-primary/90'
                )}
              >
                查看演示
              </Link>
            </div>
          </div>
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
