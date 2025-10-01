import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: '张明',
    role: '前端工程师',
    company: '科技创新公司',
    avatar: '👨‍💻',
    content: '这个平台彻底改变了我对 WebAssembly 的理解。通过实际的加密算法逆向案例，我不仅掌握了 WASM 的底层原理，还提升了安全分析能力。强烈推荐给想要深入理解前端底层技术的开发者！',
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    name: '李雪',
    role: '安全研究员',
    company: '网络安全实验室',
    avatar: '👩‍💻',
    content: '作为一名安全研究员，我需要对各种加密技术有深入的理解。这个平台提供的实战题目质量很高，覆盖了从基础到高级的各种加密算法。通过学习，我在实际工作中能够更快地识别和分析加密实现。',
    rating: 5,
    featured: true,
  },
  {
    id: 3,
    name: '王浩',
    role: '全栈开发者',
    company: '互联网创业公司',
    avatar: '👨‍🔬',
    content: 'Rust + WASM 的组合让我眼前一亮！平台不仅教会了我如何进行逆向分析，还让我了解了如何利用 WASM 优化前端性能。现在我在项目中也会使用这些技术，效果非常棒。',
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    name: '陈雨',
    role: '技术讲师',
    company: '在线教育平台',
    avatar: '👩‍🏫',
    content: '我在教学中经常需要向学生解释复杂的加密概念。这个平台的可视化演示和互动练习为我的教学提供了很好的补充材料。学生们通过实践能够更好地理解理论知识。',
    rating: 5,
    featured: false,
  },
];

export default function TestimonialHeroQuote() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'featured'

  const filteredTestimonials = filter === 'featured'
    ? testimonials.filter(t => t.featured)
    : testimonials;

  const currentTestimonial = filteredTestimonials[currentIndex];

  const filterBtnCls = (active) =>
    cn(
      'px-4 py-2 rounded-lg font-medium transition-all',
      active
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    );

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const onChangeFilter = (newFilter) => {
    setFilter(newFilter);
    setCurrentIndex(0);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-6xl mx-auto">
        {/* 标题部分 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary">学员心声</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            听听他们如何通过平台学习和成长，掌握前端与 WASM 逆向技术
          </p>
        </motion.div>

        {/* 过滤器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => onChangeFilter('all')}
            className={filterBtnCls(filter === 'all')}
          >
            全部
          </button>
          <button
            onClick={() => onChangeFilter('featured')}
            className={filterBtnCls(filter === 'featured')}
          >
            精选
          </button>
        </motion.div>

        {/* 主要内容展示 */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 md:p-12 rounded-3xl border-2 border-border shadow-xl"
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* 左侧：引用内容 */}
                <div className="md:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Quote className="w-8 h-8" />
                    <div className="flex gap-1">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-xl md:text-2xl text-card-foreground leading-relaxed">
                    "{currentTestimonial.content}"
                  </blockquote>

                  <div className="flex items-center gap-4 pt-4">
                    <div className="text-4xl">{currentTestimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-card-foreground">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-muted-foreground">
                        {currentTestimonial.role} @ {currentTestimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧：视觉元素 */}
                <div className="relative hidden md:block">
                  <div className="relative">
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl animate-pulse" />

                    {/* 统计卡片 */}
                    <div className="relative bg-card p-6 rounded-2xl border text-center">
                      <div className="text-4xl mb-2">{currentTestimonial.avatar}</div>
                      <div className="text-lg font-bold text-card-foreground mb-1">
                        学习时长
                      </div>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {Math.floor(Math.random() * 50 + 20)}+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        小时
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 导航控制 */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-card rounded-full border hover:bg-accent transition-colors shadow-lg"
              aria-label="上一个评价"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* 指示器 */}
            <div className="flex gap-3">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={cn(
                    'transition-all',
                    index === currentIndex
                      ? 'w-8 h-2 bg-primary rounded-full'
                      : 'w-2 h-2 bg-muted rounded-full hover:bg-muted-foreground/50'
                  )}
                  aria-label={`跳转到评价 ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 bg-card rounded-full border hover:bg-accent transition-colors shadow-lg"
              aria-label="下一个评价"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 底部统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 bg-card rounded-2xl border">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-muted-foreground">平均评分</div>
          </div>

          <div className="text-center p-6 bg-card rounded-2xl border">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">推荐率</div>
          </div>

          <div className="text-center p-6 bg-card rounded-2xl border">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">真实评价</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}