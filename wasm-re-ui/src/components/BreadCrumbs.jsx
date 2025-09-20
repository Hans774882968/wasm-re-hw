import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();

  // 不在首页显示面包屑
  if (location.pathname === '/') return null;

  const pathSegments = location.pathname.split('/').filter(segment => segment);

  return (
    <nav className="flex items-center space-x-1 text-sm py-4 px-4 md:px-8">
      <Link
        to="/"
        className={cn(
          'flex items-center space-x-1 text-muted-foreground hover:text-foreground',
          'transition-colors duration-200'
        )}
      >
        <Home className="h-4 w-4" />
        <span>首页</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

        // 将路径转换为更友好的名称
        let displayName = segment;
        if (segment === 'xor-encrypt') displayName = '异或加密';
        if (segment === 'aes-cbc') displayName = 'AES-CBC 加密';

        return (
          <div key={segment} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            {isLast ? (
              <span className="text-foreground font-medium">{displayName}</span>
            ) : (
              <Link
                to={path}
                className={cn(
                  'text-muted-foreground hover:text-foreground',
                  'transition-colors duration-200'
                )}
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
