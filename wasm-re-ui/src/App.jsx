import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import init, { encrypt_username } from './wasm/rust_wasm';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [ready, setReady] = useState(false);

  (async () => {
    if (!ready) {
      await init();
      setReady(true);
    }
  })();

  const handleEncrypt = () => {
    if (!input.trim()) return;
    const cipher = encrypt_username(input);
    setOutput(cipher);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Hans7 Crypto Demo</h1>

        <label className="block mb-2 text-sm">用户名</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入"
        />

        <button
          onClick={handleEncrypt}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
        >
          <FaLock /> 加密
        </button>

        {output && (
          <div className="mt-6">
            <label className="block mb-2 text-sm">密文</label>
            <div className="bg-gray-900 px-3 py-2 rounded break-all text-green-400 font-mono">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
