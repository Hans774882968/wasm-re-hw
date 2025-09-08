import { useState, useEffect } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import init, { aes_cbc_encrypt, aes_cbc_decrypt } from '@/wasm/rust_wasm';
import { toast } from 'sonner';
import { toU8 } from './utils';

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
    <div className="bg-gray-900 text-white grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Rust WASM AES-CBC</h2>

        <label className="block mb-1 text-sm">明文</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-3"
          value={encPlain}
          onChange={(e) => setEncPlain(e.target.value)}
          placeholder="请输入"
        />

        <label className="block mb-1 text-sm">Key（16 字节）</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-3 font-mono"
          value={encKey}
          onChange={(e) => setEncKey(e.target.value)}
        />

        <label className="block mb-1 text-sm">IV（16 字节）</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4 font-mono"
          value={encIv}
          onChange={(e) => setEncIv(e.target.value)}
        />

        <button
          onClick={handleEncrypt}
          disabled={!ready || !encPlain.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
        >
          <FaLock /> 加密
        </button>

        {encOut && (
          <div className="mt-6">
            <label className="block mb-2 text-sm">密文（Base64）</label>
            <div className="bg-gray-900 px-3 py-2 rounded break-all text-green-400 font-mono text-sm">
              {encOut}
            </div>
          </div>
        )}
      </div>

      {/* ---- 解密卡片 ---- */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">AES-CBC 解密</h2>

        <label className="block mb-1 text-sm">密文（Base64）</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-3"
          value={decCipher}
          onChange={(e) => setDecCipher(e.target.value)}
          placeholder="请输入 Base64 密文"
        />

        <label className="block mb-1 text-sm">Key（16 字节）</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-3 font-mono"
          value={decKey}
          onChange={(e) => setDecKey(e.target.value)}
        />

        <label className="block mb-1 text-sm">IV（16 字节）</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4 font-mono"
          value={decIv}
          onChange={(e) => setDecIv(e.target.value)}
        />

        <button
          onClick={handleDecrypt}
          disabled={!ready || !decCipher.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
        >
          <FaLockOpen /> 解密
        </button>

        {decOut && (
          <div className="mt-6">
            <label className="block mb-2 text-sm">明文</label>
            <div className="bg-gray-900 px-3 py-2 rounded break-all text-green-400 font-mono text-sm">
              {decOut}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
