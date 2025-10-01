import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="回到顶部"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
    </Button>
  );
}
