import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../BreadCrumbs';
import { Separator } from '../ui/separator';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isAtIndex = pathname === '/';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {
        !isAtIndex && (
          <>
            <Breadcrumbs />
            <Separator />
          </>
        )
      }
      {children}
    </div>
  );
}
