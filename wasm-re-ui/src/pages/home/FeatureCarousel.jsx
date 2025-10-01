import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Code,
  BookOpen,
  Zap,
  Users,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Shield,
    title: '加密算法解析',
    description: '深入学习 AES-CBC、XOR、SHA 等加密算法的实现原理和逆向分析技巧',
    details: ['对称加密原理', '哈希函数分析', '密钥管理机制', '安全性评估'],
  },
  {
    icon: Code,
    title: 'WASM 逆向技术',
    description: '掌握 WebAssembly 的底层结构和逆向分析工具使用方法',
    details: ['WASM 二进制格式', '内存布局分析', '函数调用栈', '调试技巧'],
  },
  {
    icon: BookOpen,
    title: '实践导向学习',
    description: '通过实际案例和练习题，循序渐进地提升逆向工程能力',
    details: ['渐进式难度', '真实世界案例', '即时反馈', '技能认证'],
  },
  {
    icon: Zap,
    title: '高性能计算',
    description: '体验 Rust + WASM 带来的高性能前端计算能力',
    details: ['零成本抽象', '内存安全', '并发处理', '性能优化'],
  },
  {
    icon: Users,
    title: '社区支持',
    description: '加入活跃的学习社区，与志同道合的开发者一起成长',
    details: ['技术讨论', '经验分享', '项目协作', '导师指导'],
  },
  {
    icon: Target,
    title: '技能评估',
    description: '通过挑战题目评估学习成果，获得专业认证',
    details: ['能力测评', '技能认证', '职业发展', '行业认可'],
  },
];

export default function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFeature = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToFeature = (index) => {
    setCurrentIndex(index);
  };

  const currentFeature = features[currentIndex];
  const IconComponent = currentFeature.icon;

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary">核心功能特性</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索平台的主要功能，了解如何帮助你掌握前端和 WASM 逆向技术
          </p>
        </motion.div>

        <div className="relative">
          {/* 主要内容展示 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 左侧：特性内容 */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{currentFeature.title}</h3>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentFeature.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {currentFeature.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-card rounded-lg border"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm text-card-foreground">{detail}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 右侧：视觉展示 */}
            <motion.div
              key={`visual-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative mx-auto w-80 h-80">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl animate-pulse" />

                {/* 主要卡片 */}
                <div className="relative bg-card p-8 rounded-2xl border-2 border-border shadow-xl">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-primary/10 rounded-2xl">
                      <IconComponent className="w-16 h-16 text-primary" />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h4 className="text-2xl font-bold text-card-foreground">{currentFeature.title}</h4>
                    <p className="text-muted-foreground">
                      {currentFeature.details[currentIndex % currentFeature.details.length]}
                    </p>

                    <div className="flex justify-center gap-2 pt-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={cn('w-2 h-2 rounded-full', i === currentIndex % 3 ? 'bg-primary' : 'bg-muted')}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 导航控制 */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={prevFeature}
              className="p-3 bg-card rounded-full border hover:bg-accent transition-colors shadow-lg"
              aria-label="上一个特性"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* 指示器 */}
            <div className="flex gap-3">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToFeature(index)}
                  className={cn(
                    'transition-all',
                    index === currentIndex
                      ? 'w-8 h-2 bg-primary rounded-full'
                      : 'w-2 h-2 bg-muted rounded-full hover:bg-muted-foreground/50'
                  )}
                  aria-label={`跳转到特性 ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextFeature}
              className="p-3 bg-card rounded-full border hover:bg-accent transition-colors shadow-lg"
              aria-label="下一个特性"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* 自动播放进度条 */}
          <div className="mt-6 w-full bg-muted rounded-full h-1 overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              onAnimationComplete={nextFeature}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
