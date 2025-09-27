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
import ShaDemo from './rustWasmEncryptDemos/shaDemo/ShaDemo';
import FileShaDemo from './rustWasmEncryptDemos/shaDemo/FileShaDemo';
import Base64CustomAlphabetDemo from './rustWasmEncryptDemos/base64CustomApb/Base64CustomAlphabetDemo';

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
            <Route path="/file-sha-hash-demo" element={<FileShaDemo />} />
            <Route path="/base64-custom-alphabet" element={<Base64CustomAlphabetDemo />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </NavigateForGitHubPages>
    </Router>
  );
}
