import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './common/routes';
import PageLoading from './components/PageLoading';

export default function RouterWrap() {
  return (
    <Suspense fallback={<PageLoading />}>
      {useRoutes(routes)}
    </Suspense>
  );
}
