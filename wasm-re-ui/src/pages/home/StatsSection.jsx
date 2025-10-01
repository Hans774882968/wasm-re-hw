import { motion } from 'motion/react';
import { Users, BookOpen, Code, Trophy, Zap, Target } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { FaFire } from 'react-icons/fa';

const stats = [
  {
    icon: Users,
    value: 1200,
    suffix: '+',
    label: '活跃学习者',
    description: '来自全球的开发者',
    color: 'text-blue-600',
  },
  {
    icon: BookOpen,
    value: 50,
    suffix: '+',
    label: '实践题目',
    description: '涵盖多种技术栈',
    color: 'text-green-600',
  },
  {
    icon: Code,
    value: 15,
    suffix: '+',
    label: '加密算法',
    description: '真实案例解析',
    color: 'text-purple-600',
  },
  {
    icon: Trophy,
    value: 95,
    suffix: '%',
    label: '完成率',
    description: '高满意度评价',
    color: 'text-orange-600',
  },
  {
    icon: Zap,
    value: 24,
    suffix: '/7',
    label: '在线学习',
    description: '随时随地学习',
    color: 'text-yellow-600',
  },
  {
    icon: Target,
    value: 100,
    suffix: '%',
    label: '实战导向',
    description: '项目驱动学习',
    color: 'text-red-600',
  },
];

function StatCard({ stat }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    // 因为需要 inView 所以未采用 react-countup
    if (inView) {
      const duration = 2000; // 2秒动画
      const steps = 60; // 60帧
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        setCount(Math.floor(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, stat.value]);

  const IconComponent = stat.icon;

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-card p-6 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 bg-muted rounded-lg', stat.color)}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-card-foreground">
            {count}{stat.suffix}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-card-foreground mb-1">
        {stat.label}
      </h3>

      <p className="text-sm text-muted-foreground">
        {stat.description}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-secondary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary">平台数据一览</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            数字背后是我们对廉价高品质教育的坚持，以及学员们的信任与成就
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
            />
          ))}
        </motion.div>

        {/* 底部行动号召 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-2xl border">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              加入我们，成为下一个成功故事
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              通过系统化的学习和实践，你将掌握前端和 WASM 逆向工程的核心技能，
              为你的技术职业发展开启新的可能性。
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('explore-learning');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              <FaFire />立即开始学习
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
