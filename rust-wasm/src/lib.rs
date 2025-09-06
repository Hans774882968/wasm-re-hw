use base64::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn encrypt_username(name: &str) -> String {
    let s_box = "hctf";
    let encrypted: String = name
        .trim()
        .chars()
        .enumerate()
        .map(|(i, c)| {
            let key = s_box.chars().nth(i % 4).unwrap();
            char::from_u32((c as u32) ^ (key as u32)).unwrap_or(c)
        })
        .collect();

    BASE64_STANDARD.encode(&encrypted)
    // 也可以不写 use base64::prelude::*; 直接用下面这行
    // base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &encrypted)
    // 这两种写法完全等价，后者是老版写法。一般只推荐新版写法
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
        assert_eq!(result3, "54mZ5oqf5oi55L286LSK");
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
        assert_eq!(result3, "54mZ5oqf5oi55L286LSK");
        let result4 = encrypt_username("   有空 格    ");
        assert_eq!(result4, "5p2h56iZVOahmg==")
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
}
