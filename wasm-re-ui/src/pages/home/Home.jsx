import { IntroCard } from './IntroCard';
import FuturePlanCard from './FuturePlanCard';
import { motion } from 'motion/react';
import { futurePlanCardsProps, introCardsProps } from './schema';
import HeroSection from './HeroSection';
import FeatureCarousel from './FeatureCarousel';
import StatsSection from './StatsSection';
import TestimonialHeroQuote from './TestimonialHeroQuote';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />

      <FeatureCarousel />

      <StatsSection />

      <section id="explore-learning" className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">探索学习模块</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              探索使用 WebAssembly 实现的各种加密算法，包括异或加密、 AES-CBC 加密、 SHA 哈希等。
              本平台目前展示了 Rust 编译为 WASM 后在前端的应用。
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
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
        </div>
      </section>

      <TestimonialHeroQuote />

      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">未来计划</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              持续更新内容，为学习者提供更丰富的前端、WASM逆向体验
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
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
      </section>

      <Footer />
    </div>
  );
}
