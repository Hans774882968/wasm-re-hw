import { IntroCard } from './IntroCard';
import FuturePlanCard from './FuturePlanCard';
import { motion } from 'motion/react';
import { futurePlanCardsProps, introCardsProps } from './schema';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">前端、WASM逆向学习平台</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            探索使用 WebAssembly 实现的各种加密算法，包括异或加密、 AES-CBC 加密、 SHA 哈希等。
            本平台目前展示了 Rust 编译为 WASM 后在前端的应用。
          </p>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {introCardsProps.map((card, index) => (
            <IntroCard key={index} {...card} />
          ))}
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">未来计划</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {futurePlanCardsProps.map((card, index) => (
              <FuturePlanCard key={index} {...card} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
