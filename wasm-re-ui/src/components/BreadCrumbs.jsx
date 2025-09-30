import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import { routesMp } from '@/common/routes';
import { cloneElement } from 'react';

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
          'transition-colors duration-300'
        )}
      >
        <Home className="w-4 h-4" />
        <span>首页</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const routeKey = `/${segment}`;
        const route = routesMp[routeKey];
        const icon = route?.icon ? cloneElement(route?.icon, { className: 'w-4 h-4' }) : null;

        // 将路径转换为更友好的名称
        const displayName = route?.name || segment;

        return (
          <div key={segment} className="flex items-center gap-1">
            <ChevronRight className="text-muted-foreground w-5 h-5" />

            {isLast ? (
              <>
                {icon}
                <span className="text-foreground font-medium">{displayName}</span>
              </>
            ) : (
              <Link
                to={path}
                className={cn(
                  'flex items-center gap-1',
                  'text-muted-foreground hover:text-foreground',
                  'transition-colors duration-300'
                )}
              >
                {icon}
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
