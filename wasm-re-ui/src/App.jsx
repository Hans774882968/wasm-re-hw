import { Toaster } from 'sonner';
import AesCbcDemo from './rustWasmEncryptDemos/AesCbcDemo';
import RustWasmEncryptDemo from './rustWasmEncryptDemos/RustWasmEncryptDemo';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Home from './pages/home/Home';
import { getWebsiteBasePath } from './lib/routeUtils';
import NavigateForGitHubPages from './NavigateForGitHubPages';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import ShaDemo from './rustWasmEncryptDemos/ShaDemo';

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
          },
        }}
      />
      <NavigateForGitHubPages>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/xor-encrypt" element={<RustWasmEncryptDemo />} />
            <Route path="/aes-cbc" element={<AesCbcDemo />} />
            <Route path="/sha-demo" element={<ShaDemo />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </NavigateForGitHubPages>
    </Router>
  );
}
