import init, {
  get_bytes_sha256,
  get_bytes_sha256_pure,
  get_bytes_sha256_with_salt,
  get_bytes_sha512,
  get_bytes_sha512_pure,
  get_bytes_sha512_with_salt,
} from '@/wasm/rust_wasm';

let wasmInitialized = false;

async function initRustWasm() {
  if (wasmInitialized) {
    return;
  }
  try {
    await init();
    wasmInitialized = true;
  } catch (err) {
    console.error('Rust WASM 初始化失败', err);
  }
}

self.onmessage = async function (e) {
  const { id, type, data, salt } = e.data;

  try {
    await initRustWasm();

    let result;

    if (type === 'sha256-pure') {
      result = get_bytes_sha256_pure(data);
    } else if (type === 'sha512-pure') {
      result = get_bytes_sha512_pure(data);
    } else if (type === 'sha256-default-salt') {
      result = get_bytes_sha256(data);
    } else if (type === 'sha512-default-salt') {
      result = get_bytes_sha512(data);
    } else if (type === 'sha256-salt') {
      result = get_bytes_sha256_with_salt(data, salt);
    } else if (type === 'sha512-salt') {
      result = get_bytes_sha512_with_salt(data, salt);
    } else {
      throw new Error(`Unknown hash type: ${type}`);
    }

    self.postMessage({
      id,
      type,
      result,
      status: 'success',
    });
  } catch (err) {
    self.postMessage({
      id,
      type,
      error: err.message || '计算失败',
      status: 'error',
    });
  }
};
