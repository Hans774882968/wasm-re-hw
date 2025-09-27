use base64::{
    Engine as _,
    alphabet::*,
    engine::{GeneralPurpose, GeneralPurposeConfig},
};
use thiserror::Error;
use wasm_bindgen::prelude::*;

static HANS7_CUSTOM_ALPHABET: Alphabet = {
    match Alphabet::new("ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/") {
        Ok(x) => x,
        Err(_) => panic!("creation of alphabet failed"),
    }
};

const CUSTOM_ENGINE: GeneralPurpose =
    GeneralPurpose::new(&HANS7_CUSTOM_ALPHABET, GeneralPurposeConfig::new());

#[derive(Debug, Error)]
pub enum CustomBase64Error {
    #[error("input string is empty")]
    EmptyInput,
    #[error("input is not valid UTF-8")]
    InvalidUtf8,
    #[error("base64 decode failed: {0}")]
    Base64Decode(#[from] base64::DecodeError),
    #[error("invalid base64 alphabet: {0}")]
    InvalidAlphabet(String),
}

impl From<CustomBase64Error> for JsValue {
    fn from(e: CustomBase64Error) -> Self {
        JsValue::from_str(&e.to_string())
    }
}

fn build_engine_from_alphabet(alphabet_str: &str) -> Result<GeneralPurpose, CustomBase64Error> {
    let alphabet = Alphabet::new(alphabet_str)
        .map_err(|e| CustomBase64Error::InvalidAlphabet(e.to_string()))?;
    Ok(GeneralPurpose::new(&alphabet, GeneralPurposeConfig::new()))
}

fn validate_input(input: &str) -> Result<(), CustomBase64Error> {
    if input.is_empty() {
        return Err(CustomBase64Error::EmptyInput);
    }

    Ok(())
}

/// 使用自定义码表对字符串进行 Base64 编码
#[wasm_bindgen]
pub fn encode_custom_base64(input: &str) -> Result<String, CustomBase64Error> {
    validate_input(input)?;
    let encoded = CUSTOM_ENGINE.encode(input.as_bytes());
    Ok(encoded)
}

/// 使用自定义码表对 Base64 字符串进行解码，并还原为原始字符串
#[wasm_bindgen]
pub fn decode_custom_base64(encoded: &str) -> Result<String, CustomBase64Error> {
    if encoded.is_empty() {
        return Err(CustomBase64Error::EmptyInput.into());
    }

    let decoded_bytes = CUSTOM_ENGINE
        .decode(encoded)
        .map_err(CustomBase64Error::Base64Decode)?;

    let decoded_str =
        String::from_utf8(decoded_bytes).map_err(|_| CustomBase64Error::InvalidUtf8)?;

    Ok(decoded_str)
}

/// 使用运行时提供的 Base64 码表对字符串进行编码
#[wasm_bindgen]
pub fn encode_base64_with_alphabet(
    input: &str,
    alphabet: &str,
) -> Result<String, CustomBase64Error> {
    if input.is_empty() {
        return Err(CustomBase64Error::EmptyInput.into());
    }
    if alphabet.is_empty() {
        return Err(CustomBase64Error::InvalidAlphabet("empty alphabet".into()).into());
    }

    let engine = build_engine_from_alphabet(alphabet)?;
    let encoded = engine.encode(input.as_bytes());
    Ok(encoded)
}

/// 使用运行时提供的 Base64 码表对字符串进行解码
#[wasm_bindgen]
pub fn decode_base64_with_alphabet(
    encoded: &str,
    alphabet: &str,
) -> Result<String, CustomBase64Error> {
    if encoded.is_empty() {
        return Err(CustomBase64Error::EmptyInput.into());
    }
    if alphabet.is_empty() {
        return Err(CustomBase64Error::InvalidAlphabet("empty alphabet".into()).into());
    }

    let engine = build_engine_from_alphabet(alphabet)?;
    let decoded_bytes = engine
        .decode(encoded)
        .map_err(CustomBase64Error::Base64Decode)?;
    let decoded_str =
        String::from_utf8(decoded_bytes).map_err(|_| CustomBase64Error::InvalidUtf8)?;
    Ok(decoded_str)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encode_decode_roundtrip_basic() -> anyhow::Result<()> {
        let input = "Hello, Hans7!";
        let encoded = encode_custom_base64(input)?;
        let decoded = decode_custom_base64(&encoded)?;
        assert_eq!(input, decoded);
        Ok(())
    }

    #[test]
    fn encode_decode_roundtrip_edge_cases() -> Result<(), CustomBase64Error> {
        let cases = vec![
            "",
            "a",
            "ab",
            "abc",
            "abcd",
            "Hello, 世界!", // 包含非 ASCII
            "🚀🚀🚀",
            "1234567890!@#$%^&*()",
        ];

        for case in cases {
            if case.is_empty() {
                assert!(encode_custom_base64(case).is_err());
                assert!(decode_custom_base64(case).is_err());
            } else {
                let encoded = encode_custom_base64(case)?;
                let decoded = decode_custom_base64(&encoded)?;
                assert_eq!(case, decoded, "Roundtrip failed for input: {:?}", case);
            }
        }
        Ok(())
    }

    #[test]
    fn empty_input_rejected() {
        assert!(encode_custom_base64("").is_err());
        assert!(decode_custom_base64("").is_err());
    }

    #[test]
    fn invalid_base64_string_rejected() {
        let invalids = vec!["!", "abc===", "Zm9v你们好", "abc123!!!"];
        for inv in invalids {
            let result = decode_custom_base64(inv);
            assert!(result.is_err(), "Should reject invalid base64: {}", inv);
        }
    }

    #[test]
    fn custom_alphabet_behavior_verified() -> anyhow::Result<()> {
        let input = "A";
        let encoded = encode_custom_base64(input)?;
        // 期望：无 padding，且使用自定义字符
        assert_eq!(encoded, "JJ==");

        // 再验证解码
        let decoded = decode_custom_base64("JJ==")?;
        assert_eq!(decoded, "A");

        Ok(())
    }

    #[test]
    fn custom_alphabet_utf8_behavior_verified() -> anyhow::Result<()> {
        let input = "爱拼才会赢💪";
        let encoded = encode_custom_base64(input)?;
        assert_eq!(encoded, "45rc4lf14lnM4Obz3ODr1Q+Hjt==");

        let decoded = decode_custom_base64("45rc4lf14lnM4Obz3ODr1Q+Hjt==")?;
        assert_eq!(decoded, "爱拼才会赢💪");

        Ok(())
    }

    #[test]
    fn non_utf8_after_decode_is_rejected() {
        // 构造一个合法 Base64 编码，但解码后不是 UTF-8
        // 例如：字节 [0xFF, 0xFE] 不是合法 UTF-8
        let bad_bytes = [0xFF, 0xFE];
        let fake_encoded = CUSTOM_ENGINE.encode(&bad_bytes);
        // 这个 fake_encoded 是合法 Base64（按你的码表），但解码后无法转为 String
        let result = decode_custom_base64(&fake_encoded);
        assert!(result.is_err());
        let err = result.err().unwrap();
        assert!(err.to_string().contains("input is not valid UTF-8"));
    }

    #[test]
    fn encode_decode_with_alphabet_roundtrip() -> Result<(), CustomBase64Error> {
        let input = "Rust+WASM=❤️";
        let alphabet = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
        let encoded = encode_base64_with_alphabet(input, alphabet)?;
        let decoded = decode_base64_with_alphabet(&encoded, alphabet)?;
        assert_eq!(input, decoded);
        Ok(())
    }

    #[test]
    fn encode_decode_with_standard_alphabet() -> Result<(), CustomBase64Error> {
        let input = "Hello";
        let standard = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let encoded = encode_base64_with_alphabet(input, standard)?;
        // 标准 Base64 编码 "Hello" 是 "SGVsbG8="
        assert_eq!(encoded, "SGVsbG8=");
        let decoded = decode_base64_with_alphabet("SGVsbG8=", standard)?;
        assert_eq!(decoded, "Hello");
        Ok(())
    }

    #[test]
    fn invalid_alphabet_rejected() {
        let input = "test";
        let a65 = "A".repeat(65);
        let a65 = a65.as_str();
        let invalid_alphabets = [
            "",                                                                  // 空
            "ABC",                                                               // 太短
            a65,                                                                 // 太长
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-", // 65 chars
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789++",  // 重复 '+'
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789哈",  // 非 ASCII
        ];

        for alpha in &invalid_alphabets {
            let enc_result = encode_base64_with_alphabet(input, &alpha);
            let dec_result = decode_base64_with_alphabet("any", &alpha);
            assert!(enc_result.is_err(), "Should reject alphabet: {:?}", alpha);
            assert!(dec_result.is_err(), "Should reject alphabet: {:?}", alpha);
        }
    }

    #[test]
    fn empty_alphabet_string_rejected() {
        let err1 = encode_base64_with_alphabet("x", "").unwrap_err();
        let err2 = decode_base64_with_alphabet("x", "").unwrap_err();
        assert!(err1.to_string().contains("empty alphabet"));
        assert!(err2.to_string().contains("empty alphabet"));
    }

    #[test]
    fn roundtrip_with_different_alphabets_not_compatible() {
        let input = "test";
        let alpha1 = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
        let alpha2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let encoded = encode_base64_with_alphabet(input, alpha1).unwrap();
        let result = decode_base64_with_alphabet(&encoded, alpha2);
        assert!(result.is_err());
        assert!(
            result
                .err()
                .unwrap()
                .to_string()
                .contains("base64 decode failed")
        );
    }
}
