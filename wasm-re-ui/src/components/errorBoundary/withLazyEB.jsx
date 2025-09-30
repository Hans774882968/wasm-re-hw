import { lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import RouteErrorBoundary from './RouteErrorBoundary';

/**
 * 包装 lazy 组件，自动添加 ErrorBoundary
 * @param {() => Promise<{ default: React.ComponentType }>} importFn
 * @returns {React.ComponentType}
 */
export function withLazyEB(importFn) {
  const LazyComponent = lazy(importFn);

  return function WrappedComponent(props) {
    return (
      <ErrorBoundary FallbackComponent={RouteErrorBoundary}>
        <LazyComponent {...props} />
      </ErrorBoundary>
    );
  };
}
