import { useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import init, { encrypt_username, decrypt_to_username } from '@/wasm/rust_wasm';
import { toast } from 'sonner';
import { getToastErrorInfo } from './utils';

export default function RustWasmEncryptDemo() {
  const [encInput, setEncInput] = useState('');
  const [encOutput, setEncOutput] = useState('');
  const [decInput, setDecInput] = useState('');
  const [decOutput, setDecOutput] = useState('');
  const [ready, setReady] = useState(false);

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
    <div className="bg-gray-900 text-white grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Rust WASM加密示例</h2>

        <label className="block mb-2 text-sm">用户名</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4"
          value={encInput}
          onChange={(e) => setEncInput(e.target.value)}
          placeholder="请输入"
        />

        <button
          onClick={handleEncrypt}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
        >
          <FaLock /> 加密
        </button>

        {encOutput && (
          <div className="mt-6">
            <label className="block mb-2 text-sm">密文</label>
            <div className="bg-gray-900 px-3 py-2 rounded break-all text-green-400 font-mono">
              {encOutput}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">解密</h2>

        <label className="block mb-2 text-sm">密文</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4"
          value={decInput}
          onChange={(e) => setDecInput(e.target.value)}
          placeholder="请输入"
        />

        <button
          onClick={handleDecrypt}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
        >
          <FaLockOpen /> 解密
        </button>

        {decOutput && (
          <div className="mt-6">
            <label className="block mb-2 text-sm">明文</label>
            <div className="bg-gray-900 px-3 py-2 rounded break-all text-green-400 font-mono">
              {decOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}