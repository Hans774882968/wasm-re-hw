import { Shield, Code, HashIcon } from 'lucide-react';
import { routesMp } from '@/common/routes';
import { cloneElement } from 'react';

export const introCardsProps = [
  {
    description: '使用 Rust 编译的 WASM 模块实现简单的异或加密算法。这种加密方式适合用于简单的数据混淆，但不适合高安全性场景。',
    tags: ['Rust', 'WASM', '异或加密'],
    to: '/xor-encrypt',
  },
  {
    description: '使用 Rust 编译的 WASM 模块实现 AES-CBC 加密算法。这是一种对称加密算法，广泛用于数据加密和保护。',
    tags: ['Rust', 'WASM', 'AES-CBC'],
    to: '/aes-cbc',
  },
  {
    description: '使用 Rust 编译的 WASM 模块实现高速安全的 SHA256 和 SHA512 哈希计算，支持加盐增强安全性。适用于密码处理、数据指纹等场景。',
    tags: ['Rust', 'WASM', 'SHA256', 'SHA512', '加盐哈希'],
    problemTags: ['逆向题', '简单'],
    to: '/sha-demo',
  },
  {
    description: '《Rust SHA256 / 512 演示》的扩展。支持任意文件（文本/二进制）的 SHA256 / 512 哈希计算。适用于文件完整性校验、数字取证等场景。',
    tags: ['Rust', 'WASM', '文件哈希', 'SHA256', 'SHA512', '加盐哈希'],
    problemTags: ['逆向题', '简单'],
    to: '/file-sha-hash-demo',
  },
  {
    description: '使用 Rust 编译的 WASM 模块实现自定义码表的 Base64 编解码。支持固定码表与动态码表。',
    tags: ['Rust', 'WASM', 'Base64', '自定义码表'],
    problemTags: ['逆向题', '简单'],
    to: '/base64-custom-alphabet',
  },
].map((card) => ({
  ...card,
  title: routesMp[card.to].name,
  icon: routesMp[card.to].icon ? cloneElement(routesMp[card.to].icon, {
    className: 'text-primary w-5 h-5',
  }) : null,
}));

export const futurePlanCardsProps = [
  {
    icon: <HashIcon className="text-primary w-5 h-5" />,
    title: 'SHA 哈希',
    description: '使用 Rust、Go、C++、Python 等语言实现 SHA-256 / 512 哈希算法。',
  },
  {
    icon: <Code className="text-primary w-5 h-5" />,
    title: '多语言 WASM',
    description: '引入 Rust、Go、C++、Python 等语言编译的 WASM 模块。',
  },
  {
    icon: <Shield className="text-primary w-5 h-5" />,
    title: '前端逆向靶场',
    description: '模拟付费软件验证场景，提供专业的前端逆向练习环境。',
  },
  {
    icon: <Shield className="text-primary w-5 h-5" />,
    title: '可插拔加密流程',
    description: '利用 WASM 实现多语言串联、可任意排序的的加密流程，并提供后台管理页面方便地让加密流程具备可插拔性。',
  },
  {
    icon: <Shield className="text-primary w-5 h-5" />,
    title: '复现 HCTF 加密文件流程',
    description: (
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
    ),
  },
];
