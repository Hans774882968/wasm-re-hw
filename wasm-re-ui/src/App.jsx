import { Toaster } from 'sonner';
import AesCbcDemo from './rustWasmEncryptDemos/AesCbcDemo';
import RustWasmEncryptDemo from './rustWasmEncryptDemos/RustWasmEncryptDemo';

export default function App() {
  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          classNames: {
            title: '!font-bold !text-base',
          },
        }}
      />
      <RustWasmEncryptDemo />
      <AesCbcDemo />
    </>
  );
}
