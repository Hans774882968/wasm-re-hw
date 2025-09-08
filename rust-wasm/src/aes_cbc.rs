use aes::cipher::{BlockDecryptMut, BlockEncryptMut, KeyIvInit, block_padding::Pkcs7};
use anyhow::Context;
use base64::prelude::*;
use wasm_bindgen::prelude::*;

type Aes128CbcEnc = cbc::Encryptor<aes::Aes128>;
type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;

use crate::error::AesError;

#[wasm_bindgen]
pub fn aes_cbc_encrypt(plain: &str, key: &[u8], iv: &[u8]) -> Result<String, AesError> {
    if key.len() != 16 {
        return Err(AesError::BadKeyLen(key.len()));
    }
    if iv.len() != 16 {
        return Err(AesError::BadIvLen(iv.len()));
    }

    let inp = plain.trim();

    let cipher =
        Aes128CbcEnc::new_from_slices(key, iv).map_err(|_| AesError::BadKeyLen(key.len()))?;

    let mut buf = vec![0u8; inp.len() + 16];
    buf[..inp.len()].copy_from_slice(inp.as_bytes());
    let encrypted = cipher
        .encrypt_padded_mut::<Pkcs7>(&mut buf, inp.len())
        .map_err(|e| AesError::AesEncrypt(e))?;

    Ok(BASE64_STANDARD.encode(encrypted))
}

#[wasm_bindgen]
pub fn aes_cbc_decrypt(b64_cipher: &str, key: &[u8], iv: &[u8]) -> Result<String, AesError> {
    if key.len() != 16 {
        return Err(AesError::BadKeyLen(key.len()));
    }
    if iv.len() != 16 {
        return Err(AesError::BadIvLen(iv.len()));
    }

    let cipher_text = BASE64_STANDARD.decode(b64_cipher.trim())?;

    let cipher =
        Aes128CbcDec::new_from_slices(key, iv).map_err(|_| AesError::BadKeyLen(key.len()))?;

    let mut buf = cipher_text;
    let decrypted = cipher
        .decrypt_padded_mut::<Pkcs7>(&mut buf)
        .map_err(|e| AesError::AesDecrypt(e))?;

    let plain = std::str::from_utf8(decrypted)?;
    Ok(plain.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn aes_cbc_enc_basic_test() -> anyhow::Result<()> {
        let plain = "hello world";
        let key = b"1234567890123456";
        let iv = b"abcdef9876543210";
        let b64_cipher = aes_cbc_encrypt(plain, key, iv).context("encrypt")?;
        assert_eq!(b64_cipher, "fSlN+cILgYX1p2Mo6i7waQ==");

        Ok(())
    }

    #[test]
    fn aes_cbc_enc_with_spaces_test() -> anyhow::Result<()> {
        let key = b"1234567890123456";
        let iv = b"abcdef9876543210";

        let result1 = aes_cbc_encrypt("hans7 ", key, iv).context("encrypt")?;
        assert_eq!(result1, "UDI6Jofr+62ZEcwOukh1JQ==");
        let result2 = aes_cbc_encrypt(" \n\tHANS", key, iv).context("encrypt")?;
        assert_eq!(result2, "IjXkq9Oi+qmFQa8Kr63jAQ==");
        let result3 = aes_cbc_encrypt("  \n  爱拼才会赢 \t", key, iv).context("encrypt")?;
        assert_eq!(result3, "kYY4TkUH8rFQJF5PL3kLlw==");
        let result4 = aes_cbc_encrypt("   有空 格    ", key, iv).context("encrypt")?;
        assert_eq!(result4, "84At44OKgcfjEp2fhbdyWg==");

        Ok(())
    }

    #[test]
    fn aes_cbc_dec_basic_test() -> anyhow::Result<()> {
        let plain = "hello world";
        let key = b"1234567890123456";
        let iv = b"abcdef9876543210";
        let b64_cipher = "fSlN+cILgYX1p2Mo6i7waQ==";
        let decrypted = aes_cbc_decrypt(&b64_cipher, key, iv).context("decrypt")?;
        assert_eq!(decrypted, plain);

        Ok(())
    }

    #[test]
    fn aes_cbc_dec_with_spaces_test() -> anyhow::Result<()> {
        let key = b"1234567890123456";
        let iv = b"abcdef9876543210";

        let result1 = aes_cbc_decrypt("  UDI6Jofr+62ZEcwOukh1JQ== ", key, iv).context("decrypt")?;
        assert_eq!(result1, "hans7");
        let result2 =
            aes_cbc_decrypt(" \n\tIjXkq9Oi+qmFQa8Kr63jAQ==", key, iv).context("decrypt")?;
        assert_eq!(result2, "HANS");
        let result3 =
            aes_cbc_decrypt("  \r\n  kYY4TkUH8rFQJF5PL3kLlw== \t", key, iv).context("decrypt")?;
        assert_eq!(result3, "爱拼才会赢");
        let result4 =
            aes_cbc_decrypt("   84At44OKgcfjEp2fhbdyWg==    ", key, iv).context("decrypt")?;
        assert_eq!(result4, "有空 格");

        Ok(())
    }

    #[test]
    fn aes_cbc_basic_test() -> anyhow::Result<()> {
        let plain = "hello world";
        let key = b"1234567890123456";
        let iv = b"abcdef9876543210";
        let b64_cipher = aes_cbc_encrypt(plain, key, iv).context("encrypt")?;
        let decrypted = aes_cbc_decrypt(&b64_cipher, key, iv).context("decrypt")?;
        assert_eq!(decrypted, plain);

        Ok(())
    }
}
