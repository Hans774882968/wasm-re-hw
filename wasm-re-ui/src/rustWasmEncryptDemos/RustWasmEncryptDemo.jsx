import { useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import init, { encrypt_username, decrypt_to_username } from '@/wasm/rust_wasm';
import { toast } from 'sonner';
import { getToastErrorInfo } from './utils';
import { cn } from '@/lib/utils';

export default function RustWasmEncryptDemo() {
  const [encInput, setEncInput] = useState('');
  const [encOutput, setEncOutput] = useState('');
  const [decInput, setDecInput] = useState('');
  const [decOutput, setDecOutput] = useState('');
  const [ready, setReady] = useState(false);

  const shouldDisableEncBtn = !encInput.trim() || !ready;
  const shouldDisableDecBtn = !decInput.trim() || !ready;

  (async () => {
    if (!ready) {
      await init();
      setReady(true);
    }
  })();

  const handleEncrypt = () => {
    if (!encInput.trim()) return;
    const cipher = encrypt_username(encInput);
    setEncOutput(cipher);
  };

  const handleDecrypt = () => {
    if (!decInput.trim()) return;
    try {
      const username = decrypt_to_username(decInput);
      setDecOutput(username);
    } catch (e) {
      console.error('解密时出错', e);
      const toastErrorInfo = getToastErrorInfo(e);
      toast.error(toastErrorInfo);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">异或加密演示</h1>
          <p className="text-muted-foreground">
            使用 Rust 编译的 WASM 模块实现简单的异或加密算法
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cn(
            'bg-card rounded-xl shadow-lg p-6 border border-border'
          )}>
            <h2 className="text-xl font-bold mb-4">加密</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">用户名</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={encInput}
                  onChange={(e) => setEncInput(e.target.value)}
                  placeholder="请输入"
                />
              </div>

              <button
                onClick={handleEncrypt}
                disabled={shouldDisableEncBtn}
                className={cn(
                  'w-full flex items-center justify-center gap-2',
                  'bg-primary text-primary-foreground py-2 px-4 rounded-md',
                  'transition-colors duration-200',
                  'disabled:opacity-50 disabled:pointer-events-none',
                  'hover:bg-primary/90'
                )}
              >
                <FaLock /> 加密
              </button>

              {encOutput && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">密文（Base64）</label>
                  <div className={cn(
                    'bg-muted px-3 py-2 rounded-md break-all',
                    'text-foreground font-mono text-sm'
                  )}>
                    {encOutput}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={cn(
            'bg-card rounded-xl shadow-lg p-6 border border-border'
          )}>
            <h2 className="text-xl font-bold mb-4">解密</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">密文（Base64）</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={decInput}
                  onChange={(e) => setDecInput(e.target.value)}
                  placeholder="请输入 Base64 密文"
                />
              </div>

              <button
                onClick={handleDecrypt}
                disabled={shouldDisableDecBtn}
                className={cn(
                  'w-full flex items-center justify-center gap-2',
                  'bg-primary text-primary-foreground py-2 px-4 rounded-md',
                  'transition-colors duration-200',
                  'disabled:opacity-50 disabled:pointer-events-none',
                  'hover:bg-primary/90'
                )}
              >
                <FaLockOpen /> 解密
              </button>

              {decOutput && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">明文</label>
                  <div className={cn(
                    'bg-muted px-3 py-2 rounded-md break-all',
                    'text-foreground font-mono text-sm'
                  )}>
                    {decOutput}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
