mod aes_cbc;
mod aes_cbc_error;
mod custom_base64;
mod sha_demo;
mod xor_demo;

pub use crate::aes_cbc::{aes_cbc_decrypt, aes_cbc_encrypt};
pub use crate::custom_base64::{decode_custom_base64, encode_custom_base64};
pub use crate::sha_demo::sha_bytes_demo::{
    get_bytes_sha256, get_bytes_sha256_pure, get_bytes_sha256_with_salt, get_bytes_sha512,
    get_bytes_sha512_pure, get_bytes_sha512_with_salt,
};
pub use crate::sha_demo::sha_demo::{
    get_str_sha256, get_str_sha256_pure, get_str_sha256_with_salt, get_str_sha512,
    get_str_sha512_pure, get_str_sha512_with_salt,
};
pub use crate::xor_demo::{decrypt_to_username, encrypt_username};
