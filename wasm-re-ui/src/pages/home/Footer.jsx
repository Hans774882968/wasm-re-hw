import { motion } from 'motion/react';
import {
  Heart,
  Shield,
  Code,
  BookOpen,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  '学习资源': [
    { label: '入门指南', href: '/guide' },
    { label: '视频教程', href: '/tutorials' },
    { label: '实战项目', href: '/projects' },
    { label: '技术文档', href: '/docs' },
  ],
  '社区': [
    { label: '讨论论坛', href: '/forum' },
    { label: '学习小组', href: '/groups' },
    { label: '技术分享', href: '/blog' },
    { label: '贡献指南', href: '/contribute' },
  ],
  '关于': [
    { label: '关于我们', href: '/about' },
    { label: '联系方式', href: '/contact' },
    { label: '隐私政策', href: '/privacy' },
    { label: '服务条款', href: '/terms' },
  ],
};

const features = [
  { icon: Shield, label: '安全可靠' },
  { icon: Code, label: '开源项目' },
  { icon: BookOpen, label: '免费学习' },
  { icon: Users, label: '社区支持' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-secondary/10 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* 主要内容区域 */}
        <div className="px-4 md:px-8 py-8 lg:py-16">
          <div className="space-y-8 lg:space-y-16">
            {/* 品牌介绍 */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-primary mb-4">
                  前端、WASM逆向学习平台
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  致力于为开发者提供高质量的 WebAssembly 和前端逆向工程学习资源。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  通过实践项目和社区支持，帮助每一位学习者掌握前端逆向核心技术。
                </p>
              </motion.div>

              {/* 特性标签 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-2 gap-3"
              >
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span>{feature.label}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* 链接栏目 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <h4 className="font-semibold text-card-foreground mb-4">
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* 底部版权信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 md:px-8 py-6 md:py-8 border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>© 2025 前端、WASM逆向学习平台</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-heartbeat" />
              <span>by Hans7</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                隐私政策
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                服务条款
              </Link>
              <Link to="/sitemap" className="hover:text-primary transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
