use base64::prelude::*;
use wasm_bindgen::prelude::*;

fn string_xor(bytes: &[u8]) -> Vec<u8> {
    let s_box = b"hctf";
    let encrypted = bytes
        .iter()
        .enumerate()
        .map(|(i, &b)| b ^ s_box[i % s_box.len()])
        .collect();
    encrypted
}

#[wasm_bindgen]
pub fn encrypt_username(name: &str) -> String {
    let name_bytes = name.trim().as_bytes(); // 获取 UTF-8 字节切片
    let encrypted = string_xor(name_bytes);
    BASE64_STANDARD.encode(&encrypted)
    // 也可以不写 use base64::prelude::*; 直接用下面这行
    // base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &encrypted)
    // 这两种写法完全等价，后者是老版写法。一般只推荐新版写法
}

#[wasm_bindgen]
pub fn decrypt_to_username(encrypted: &str) -> Result<String, String> {
    let name_bytes = BASE64_STANDARD
        .decode(encrypted)
        .map_err(|e| format!("[rust-wasm] Invalid Base64: {}", e))?;
    let decrypted = string_xor(&name_bytes);
    String::from_utf8(decrypted).map_err(|e| format!("[rust-wasm] Invalid UTF-8: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encrypt_username_basic_test() {
        let result1 = encrypt_username("hans7");
        assert_eq!(result1, "AAIaFV8=");
        let result2 = encrypt_username("HANS");
        assert_eq!(result2, "ICI6NQ==");
        let result3 = encrypt_username("爱拼才会赢");
        assert_eq!(result3, "j+vFgOPfku/lh8j8gNbW");
        let result4 = encrypt_username("Acm_L0ver");
        assert_eq!(result4, "KQAZOSRTAgMa");
    }

    #[test]
    fn encrypt_username_with_spaces_test() {
        let result1 = encrypt_username("hans7 ");
        assert_eq!(result1, "AAIaFV8=");
        let result2 = encrypt_username(" \n\tHANS");
        assert_eq!(result2, "ICI6NQ==");
        let result3 = encrypt_username("  \n  爱拼才会赢 \t");
        assert_eq!(result3, "j+vFgOPfku/lh8j8gNbW");
        let result4 = encrypt_username("   有空 格    ");
        assert_eq!(result4, "jv/9gcHZVIDI3w==")
    }

    #[test]
    fn encrypt_username_empty_input_test() {
        let result = encrypt_username("");
        assert_eq!(result, "");
    }

    #[test]
    fn encrypt_username_equal_to_box_test() {
        let result = encrypt_username("hctf");
        assert_eq!(result, "AAAAAA==");
    }

    #[test]
    fn decrypt_to_username_basic_test() -> Result<(), String> {
        let result1 = decrypt_to_username("AAIaFV8=")?;
        assert_eq!(result1, "hans7");
        let result2 = decrypt_to_username("ICI6NQ==")?;
        assert_eq!(result2, "HANS");
        let result3 = decrypt_to_username("j+vFgOPfku/lh8j8gNbW")?;
        assert_eq!(result3, "爱拼才会赢");
        let result4 = decrypt_to_username("KQAZOSRTAgMa")?;
        assert_eq!(result4, "Acm_L0ver");
        let result5 = decrypt_to_username("AAAAAA==")?;
        assert_eq!(result5, "hctf");
        let result6 = decrypt_to_username("jv/9gcHZVIDI3w==")?;
        assert_eq!(result6, "有空 格");

        Ok(())
    }

    #[test]
    fn decrypt_to_username_empty_input_test() -> Result<(), String> {
        let result = decrypt_to_username("")?;
        assert_eq!(result, "");

        Ok(())
    }

    #[test]
    fn decrypt_to_username_equal_to_box_test() -> Result<(), String> {
        let result = decrypt_to_username("AAAAAA==")?;
        assert_eq!(result, "hctf");

        Ok(())
    }

    #[test]
    fn decrypt_to_username_invalid_base64_test() {
        let result = decrypt_to_username("AAAAAAA==invalid");
        assert!(result.is_err());
        let err = result.err().unwrap();
        assert!(err.contains("[rust-wasm] Invalid Base64"));
    }

    #[test]
    fn decrypt_to_username_invalid_utf8_test() {
        let corrupted = BASE64_STANDARD.encode(&[0xFF, 0xFF, 0xFF]);
        let result = decrypt_to_username(&corrupted);
        assert!(result.is_err());
        let err = result.err().unwrap();
        assert!(err.contains("[rust-wasm] Invalid UTF-8"));
    }
}
