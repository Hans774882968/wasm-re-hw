import { Toaster } from 'sonner';
import RustWasmEncryptDemo from './rustWasmEncryptDemo/RustWasmEncryptDemo';

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
    </>
  );
}
