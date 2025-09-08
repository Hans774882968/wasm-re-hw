use thiserror::Error;
use wasm_bindgen::prelude::*;

use aes::cipher::block_padding::UnpadError;
use aes::cipher::inout::PadError;

#[derive(Debug, Error)]
pub enum AesError {
    #[error("base64 decode failed: {0}")]
    Base64(#[from] base64::DecodeError),
    #[error("invalid utf-8: {0}")]
    Utf8(#[from] std::str::Utf8Error),
    // 24/32 is for AES-192 and AES-256, which we don't consider now
    #[error("invalid key length: expected 16 bytes, got {0}")]
    BadKeyLen(usize),
    #[error("invalid iv length: expected 16 bytes, got {0}")]
    BadIvLen(usize),
    #[error("aes encrypt failed: {0}")]
    AesEncrypt(PadError),
    #[error("aes decrypt failed: {0}")]
    AesDecrypt(UnpadError),
}

impl From<PadError> for AesError {
    fn from(e: PadError) -> Self {
        AesError::AesEncrypt(e)
    }
}

impl From<UnpadError> for AesError {
    fn from(e: UnpadError) -> Self {
        AesError::AesDecrypt(e)
    }
}

impl From<AesError> for JsValue {
    fn from(e: AesError) -> Self {
        JsValue::from_str(&e.to_string())
    }
}
