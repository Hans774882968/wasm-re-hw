use thiserror::Error;
use wasm_bindgen::prelude::*;

#[derive(Error, Debug)]
pub enum ShaHashError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    #[error("Sha Hash computation failed")]
    HashFailed,
}

impl From<ShaHashError> for JsValue {
    fn from(e: ShaHashError) -> Self {
        JsValue::from_str(&e.to_string())
    }
}
