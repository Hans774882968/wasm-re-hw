use super::utils::*;
use sha2::{Digest, Sha256, Sha512};
use wasm_bindgen::prelude::*;

pub fn compute_sha256_bytes(data: &[u8]) -> HashOutput {
    let mut hasher = Sha256::new();
    hasher.update(data);
    let result = hasher.finalize();
    HashOutput {
        bytes: result.to_vec(),
    }
}

pub fn compute_sha512_bytes(data: &[u8]) -> HashOutput {
    let mut hasher = Sha512::new();
    hasher.update(data);
    let result = hasher.finalize();
    HashOutput {
        bytes: result.to_vec(),
    }
}

#[wasm_bindgen]
pub fn get_bytes_sha256_pure(data: &[u8]) -> String {
    compute_sha256_bytes(data).to_hex()
}

#[wasm_bindgen]
pub fn get_bytes_sha512_pure(data: &[u8]) -> String {
    compute_sha512_bytes(data).to_hex()
}

fn get_salted_bytes(data: &[u8], salt: &str) -> Vec<u8> {
    let salt_bytes = salt.as_bytes();
    let mut combined = Vec::with_capacity(data.len() + salt_bytes.len() + 1); // +1 for separator
    combined.extend_from_slice(data);
    if !salt.is_empty() {
        combined.push(b'_'); // separator
        combined.extend_from_slice(salt_bytes);
    }
    combined
}

#[wasm_bindgen]
pub fn get_bytes_sha256_with_salt(data: &[u8], salt: &str) -> String {
    let combined = get_salted_bytes(data, salt);
    compute_sha256_bytes(&combined).to_hex()
}

#[wasm_bindgen]
pub fn get_bytes_sha512_with_salt(data: &[u8], salt: &str) -> String {
    let combined = get_salted_bytes(data, salt);
    compute_sha512_bytes(&combined).to_hex()
}

#[wasm_bindgen]
pub fn get_bytes_sha256(data: &[u8]) -> String {
    get_bytes_sha256_with_salt(data, "hans7_sha_bytes")
}

#[wasm_bindgen]
pub fn get_bytes_sha512(data: &[u8]) -> String {
    get_bytes_sha512_with_salt(data, "hans7_sha_bytes")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sha256_bytes_pure_basic_test() -> anyhow::Result<()> {
        let empty = &[] as &[u8];
        let output_empty = compute_sha256_bytes(empty).to_hex();
        assert_eq!(
            output_empty,
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );

        let hello = b"hello world";
        let output_hello = compute_sha256_bytes(hello).to_hex();
        assert_eq!(
            output_hello,
            "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
        );

        // 测试包含中文和 emoji 的 UTF-8 字节
        let chinese = "你好🙂啊".as_bytes();
        let output_chinese = compute_sha256_bytes(chinese).to_hex();
        assert_eq!(
            output_chinese,
            "dcb66f3e712f20dc1f22cdeb8afa0219dfcfa7f0c5afab4e919c4e86c4c41cd5"
        );

        Ok(())
    }

    #[test]
    fn sha512_bytes_pure_basic_test() -> anyhow::Result<()> {
        let empty = &[] as &[u8];
        let output_empty = compute_sha512_bytes(empty).to_hex();
        assert_eq!(
            output_empty,
            "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"
        );

        let hello = b"hello world";
        let output_hello = compute_sha512_bytes(hello).to_hex();
        assert_eq!(
            output_hello,
            "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f"
        );

        let chinese = "你好🙂啊".as_bytes();
        let output_chinese = compute_sha512_bytes(chinese).to_hex();
        assert_eq!(
            output_chinese,
            "a526e15763e22c34d1cceafeaafe0c45039abe3f285d4f752f965a5f8f7f4e8eb7fcb891ccf2f6c9261dc5d6610539128c321f65b1bd82d7de35a41f4c7cdd4a"
        );

        Ok(())
    }

    #[test]
    fn sha256_bytes_with_salt_test() -> anyhow::Result<()> {
        let data = b"hello world";
        let salt = "hans666";

        let result = get_bytes_sha256_with_salt(data, salt);
        assert_eq!(
            result,
            "5cc9e7b38b495b7ad80b8b3fa8de50fa125e4121a63fc65b22bd8c0988216057"
        );

        let result_empty_salt = get_bytes_sha256_with_salt(data, "");
        assert_eq!(
            result_empty_salt,
            "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
        );

        Ok(())
    }

    #[test]
    fn sha512_bytes_with_salt_test() -> anyhow::Result<()> {
        let data = b"hello world";
        let salt = "hans666";

        let result = get_bytes_sha512_with_salt(data, salt);
        assert_eq!(
            result,
            "95dc0a4b63edaa5740b0f766c79870c1eca45964edfcb1722917e7c609f1836c5fa638b1917991d6d7ce19fdecd73b633d2ee0e58414297cf1c8b69a81b1d459"
        );

        let result_empty_salt = get_bytes_sha512_with_salt(data, "");
        assert_eq!(
            result_empty_salt,
            "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f"
        );

        Ok(())
    }

    #[test]
    fn sha256_bytes_default_salt_test() -> anyhow::Result<()> {
        let data = b"hello world";
        let result = get_bytes_sha256(data);
        assert_eq!(
            result,
            "44dd428c749a4827523345f20f93b42eb7c6f1bbc97128488aff0bc12db8b32c"
        );

        let empty_data = &[] as &[u8];
        let result_empty = get_bytes_sha256(empty_data);
        assert_eq!(
            result_empty,
            "0798d91fe230a26d8cb2f2cbf1e86e1a1470cd110e76f6abdb09e09cf52d446e"
        );

        Ok(())
    }

    #[test]
    fn sha512_bytes_default_salt_test() -> anyhow::Result<()> {
        let data = b"hello world";
        let result = get_bytes_sha512(data);
        assert_eq!(
            result,
            "7411785d334b7df5990c08de1931ca2a81462b7f60dc9959852dbb4f6a88f173b9b2dba1f650eb0fe26bf173d684554a6a72678718f6b307b20c5ea3209c3eb1"
        );

        let empty_data = &[] as &[u8];
        let result_empty = get_bytes_sha512(empty_data);
        assert_eq!(
            result_empty,
            "710ade43df89929b24c69371fb7b5b61901cb2d2fe379005a6b107089cafb3dd7f34e1a7e16ba4ca83817f4e6f1da13df5e4348b69e747eebfbc403a922c368c"
        );

        Ok(())
    }

    #[test]
    fn sha_bytes_with_binary_data_test() -> anyhow::Result<()> {
        // 测试二进制数据：包含 0x00, 0xFF 等非文本字节
        let binary_data = &[0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD];

        let sha256_result = compute_sha256_bytes(binary_data).to_hex();
        assert_eq!(
            sha256_result,
            "feb1aba6fea741741b1bbcc974f74fed337b535b8eec7223b6dd15d7108f08e3"
        );

        let sha512_result = compute_sha512_bytes(binary_data).to_hex();
        assert_eq!(
            sha512_result,
            "252de9649523672ab171df5106a9a8619e3203dcca886f94de8c6fa90deb6caf2b67c182e2333441f4cab950b70b0757579d6627783be4e9879ea179798e9d86"
        );

        let salted_256 = get_bytes_sha256_with_salt(binary_data, "hans7");
        assert_eq!(
            salted_256,
            "808e64b4c2196b49c011ef4022e68953ebc1a61e64527d3fe96536052e34c9db"
        );

        Ok(())
    }
}
