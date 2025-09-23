use super::sha_demo_error::ShaHashError;
use std::fmt;

// 封装输入字符串，可添加各种守卫，避免泛型生命周期泛滥
#[derive(Debug)]
pub struct InputStr<'a> {
    pub s: &'a str,
}

impl<'a> InputStr<'a> {
    pub fn new(inp: &'a str) -> Result<Self, ShaHashError> {
        let s = inp.trim();
        if s.is_empty() {
            return Err(ShaHashError::InvalidInput("String is empty".into()));
        }
        Ok(Self { s })
    }

    pub fn as_str(&self) -> &'a str {
        self.s
    }
}

// 封装哈希结果，便于统一处理和格式化
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct HashOutput {
    pub bytes: Vec<u8>,
}

impl HashOutput {
    pub fn to_hex(&self) -> String {
        self.bytes.iter().map(|b| format!("{:02x}", b)).collect()
    }

    pub fn as_bytes(&self) -> &[u8] {
        &self.bytes
    }
}

impl fmt::Display for HashOutput {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_hex())
    }
}
