import { Shield, Code, Key, HashIcon } from 'lucide-react';
import { IntroCard } from './IntroCard';
import FuturePlanCard from './FuturePlanCard';
import { FaFile } from 'react-icons/fa';
import AnimatedCardGrid from '@/components/AnimatedCardGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">WASM 逆向工程学习平台</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            探索使用 WebAssembly 实现的各种加密算法，包括异或加密、 AES-CBC 加密、 SHA 哈希等。
            本平台目前展示了 Rust 编译为 WASM 后在前端的应用。
          </p>
        </header>

        <AnimatedCardGrid
          columns={{ sm: 1, md: 2 }}
          gap="1.5rem"
          staggerDelay={100}
        >
          <IntroCard
            icon={<Key className="text-primary h-5 w-5" />}
            title="Rust WASM 异或加密"
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

          <IntroCard
            icon={<FaFile className="text-primary h-5 w-5" />}
            title="Rust 文件 SHA 哈希演示"
            description="《Rust SHA256 / 512 演示》的扩展。支持任意文件（文本/二进制）的 SHA256 / 512 哈希计算。适用于文件完整性校验、数字取证等场景。"
            tags={['Rust', 'WASM', '文件哈希', 'SHA256', 'SHA512', '加盐哈希']}
            problemTags={['逆向题', '简单']}
            to="/file-sha-hash-demo"
          />

          <IntroCard
            icon={<Key className="text-primary h-5 w-5" />}
            title="Rust Base64 自定义码表"
            description="使用 Rust 编译的 WASM 模块实现自定义码表的 Base64 编解码。支持固定码表与动态码表。"
            tags={['Rust', 'WASM', 'Base64']}
            problemTags={['逆向题', '简单']}
            to="/base64-custom-alphabet"
          />
        </AnimatedCardGrid>

        {/* 未来计划部分 */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">未来计划</h2>
          <AnimatedCardGrid columns={{ sm: 1, md: 2, lg: 3 }} gap="1rem" staggerDelay={80}>
            <FuturePlanCard
              icon={<HashIcon className="h-5 w-5 text-primary" />}
              title="SHA 哈希"
              description="使用 Rust、Go、C++、Python 等语言实现 SHA-256 / 512 哈希算法。"
            />

            <FuturePlanCard
              icon={<Code className="h-5 w-5 text-primary" />}
              title="多语言 WASM"
              description="引入 Rust、Go、C++、Python 等语言编译的 WASM 模块。"
            />

            <FuturePlanCard
              icon={<Shield className="h-5 w-5 text-primary" />}
              title="前端逆向靶场"
              description="模拟付费软件验证场景，提供专业的前端逆向练习环境。"
            />

            <FuturePlanCard
              icon={<Shield className="h-5 w-5 text-primary" />}
              title="可插拔加密流程"
              description="利用 WASM 实现多语言串联的加密流程，并提供后台管理页面方便地让加密流程具备可插拔性。"
            />

            <FuturePlanCard
              icon={<Shield className="h-5 w-5 text-primary" />}
              title="复现 HCTF 加密文件流程"
              description={
                <>
                  这个灵感来自于作者的个人项目
                  <a
                    href="https://github.com/Hans774882968/file-encrypt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    file-encrypt
                  </a>
                  ，宣传一下~
                </>
              }
            />
          </AnimatedCardGrid>
        </div>
      </div>
    </div>
  );
}
