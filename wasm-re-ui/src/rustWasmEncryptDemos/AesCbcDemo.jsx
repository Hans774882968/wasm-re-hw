import { useState, useEffect } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import init, { aes_cbc_encrypt, aes_cbc_decrypt } from '@/wasm/rust_wasm';
import { toast } from 'sonner';
import { toU8 } from './utils';
import { cn } from '@/lib/utils';

export default function AesCbcDemo() {
  const [ready, setReady] = useState(false);

  const [encPlain, setEncPlain] = useState('');
  const [encKey, setEncKey] = useState('0123456789abcdef');
  const [encIv, setEncIv] = useState('abcdef9876543210');
  const [encOut, setEncOut] = useState('');

  const [decCipher, setDecCipher] = useState('');
  const [decKey, setDecKey] = useState('0123456789abcdef');
  const [decIv, setDecIv] = useState('abcdef9876543210');
  const [decOut, setDecOut] = useState('');

  useEffect(() => {
    init().then(() => setReady(true));
  }, []);

  const handleEncrypt = () => {
    if (!encPlain.trim()) return;
    try {
      const cipherB64 = aes_cbc_encrypt(encPlain, toU8(encKey), toU8(encIv));
      setEncOut(cipherB64);
    } catch (e) {
      console.error('加密出错', e);
      toast.error(`加密出错：${e}`);
    }
  };

  const handleDecrypt = () => {
    if (!decCipher.trim()) return;
    try {
      const plain = aes_cbc_decrypt(decCipher, toU8(decKey), toU8(decIv));
      setDecOut(plain);
    } catch (e) {
      console.error('解密出错', e);
      toast.error(`解密出错：${e}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AES-CBC 加密演示</h1>
          <p className="text-muted-foreground">
            使用 Rust 编译的 WASM 模块实现 AES-CBC 加密算法
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cn(
            'bg-card rounded-xl shadow-lg p-6 border border-border'
          )}>
            <h2 className="text-xl font-bold mb-4">加密</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">明文</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={encPlain}
                  onChange={(e) => setEncPlain(e.target.value)}
                  placeholder="请输入"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Key（16 字节）</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground font-mono',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={encKey}
                  onChange={(e) => setEncKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">IV（16 字节）</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground font-mono',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={encIv}
                  onChange={(e) => setEncIv(e.target.value)}
                />
              </div>

              <button
                onClick={handleEncrypt}
                disabled={!ready || !encPlain.trim()}
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

              {encOut && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">密文（Base64）</label>
                  <div className={cn(
                    'bg-muted px-3 py-2 rounded-md break-all',
                    'text-foreground font-mono text-sm'
                  )}>
                    {encOut}
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
                  value={decCipher}
                  onChange={(e) => setDecCipher(e.target.value)}
                  placeholder="请输入 Base64 密文"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Key（16 字节）</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground font-mono',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={decKey}
                  onChange={(e) => setDecKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">IV（16 字节）</label>
                <input
                  className={cn(
                    'w-full px-3 py-2 rounded-md bg-input text-foreground font-mono',
                    'border border-border focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                  value={decIv}
                  onChange={(e) => setDecIv(e.target.value)}
                />
              </div>

              <button
                onClick={handleDecrypt}
                disabled={!ready || !decCipher.trim()}
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

              {decOut && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium">明文</label>
                  <div className={cn(
                    'bg-muted px-3 py-2 rounded-md break-all',
                    'text-foreground font-mono text-sm'
                  )}>
                    {decOut}
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
