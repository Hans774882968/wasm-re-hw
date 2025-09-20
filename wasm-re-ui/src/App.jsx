import { Toaster } from 'sonner';
import AesCbcDemo from './rustWasmEncryptDemos/AesCbcDemo';
import RustWasmEncryptDemo from './rustWasmEncryptDemos/RustWasmEncryptDemo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Breadcrumbs from './components/BreadCrumbs';
import Home from './pages/Home';
import { getWebsiteBasePath } from './lib/routeUtils';

const basePath = getWebsiteBasePath();

export default function App() {
  return (
    <Router basename={basePath}>
      <Toaster
        position='top-center'
        toastOptions={{
          classNames: {
            title: '!font-bold !text-base',
          },
        }}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/xor-encrypt" element={<RustWasmEncryptDemo />} />
          <Route path="/aes-cbc" element={<AesCbcDemo />} />
        </Routes>
      </div>
    </Router>
  );
}
