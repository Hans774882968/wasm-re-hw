import { Toaster } from 'sonner';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { getWebsiteBasePath } from './lib/routeUtils';
import NavigateForGitHubPages from './NavigateForGitHubPages';
import Layout from './components/layout/Layout';
import RouterWrap from './RouterWrap';

const basePath = getWebsiteBasePath();

export default function App() {
  return (
    <Router basename={basePath}>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            color: 'var(--foreground)',
            background: 'var(--background)',
            borderColor: 'var(--border)',
          },
          classNames: {
            title: '!font-bold !text-base',
            description: '!text-foreground',
            actionButton: '!bg-primary !text-primary-foreground !font-bold hover:!bg-primary/85',
          },
        }}
      />
      <NavigateForGitHubPages>
        <Layout>
          <RouterWrap />
        </Layout>
      </NavigateForGitHubPages>
    </Router>
  );
}
