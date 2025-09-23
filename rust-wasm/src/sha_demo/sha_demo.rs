use super::sha_demo_error::ShaHashError;
use super::utils::*;
use sha2::{Digest, Sha256, Sha512};
use wasm_bindgen::prelude::*;

pub fn compute_sha256(input: InputStr) -> Result<HashOutput, ShaHashError> {
    let mut hasher = Sha256::new();
    hasher.update(input.s.as_bytes());

    let result = hasher.finalize();
    let hash_bytes = result.to_vec();

    Ok(HashOutput { bytes: hash_bytes })
}

pub fn compute_sha512(input: InputStr) -> Result<HashOutput, ShaHashError> {
    let mut hasher = Sha512::new();
    hasher.update(input.s.as_bytes());

    let result = hasher.finalize();
    let hash_bytes = result.to_vec();

    Ok(HashOutput { bytes: hash_bytes })
}

#[wasm_bindgen]
pub fn get_str_sha256_pure(input: &str) -> Result<String, ShaHashError> {
    let input_str = InputStr::new(input)?;
    let output = compute_sha256(input_str)?;
    Ok(output.to_hex())
}

#[wasm_bindgen]
pub fn get_str_sha512_pure(input: &str) -> Result<String, ShaHashError> {
    let input_str = InputStr::new(input)?;
    let output = compute_sha512(input_str)?;
    Ok(output.to_hex())
}

fn get_salted_str(input: &str, salt: &str) -> String {
    if salt.trim().is_empty() {
        return input.trim().to_string();
    }
    format!("{}_{}", input.trim(), salt.trim())
}

#[wasm_bindgen]
pub fn get_str_sha256_with_salt(input: &str, salt: &str) -> Result<String, ShaHashError> {
    let combined = get_salted_str(input, salt);
    let inp_combined = InputStr::new(&combined)?;
    let output = compute_sha256(inp_combined)?;
    Ok(output.to_hex())
}

#[wasm_bindgen]
pub fn get_str_sha512_with_salt(input: &str, salt: &str) -> Result<String, ShaHashError> {
    let combined = get_salted_str(input, salt);
    let inp_combined = InputStr::new(&combined)?;
    let output = compute_sha512(inp_combined)?;
    Ok(output.to_hex())
}

#[wasm_bindgen]
pub fn get_str_sha256(input: &str) -> Result<String, ShaHashError> {
    get_str_sha256_with_salt(input, "hans7")
}

#[wasm_bindgen]
pub fn get_str_sha512(input: &str) -> Result<String, ShaHashError> {
    get_str_sha512_with_salt(input, "hans7")
}

#[cfg(test)]
mod tests {
    use anyhow::Ok;

    use super::*;

    #[test]
    fn sha256_pure_basic_test() -> anyhow::Result<()> {
        let input1 = "hello world";
        let output1 = get_str_sha256_pure(input1)?;
        assert_eq!(
            output1,
            "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
        );
        let input2 = "爱拼才会赢";
        let output2 = get_str_sha256_pure(input2)?;
        assert_eq!(
            output2,
            "0d57b507c74494cf8575f2ee9dce83cfca85cc97080b7c5691d8b5358afe02b3"
        );
        let input3 = "你好🙂啊";
        let output3 = get_str_sha256_pure(input3)?;
        assert_eq!(
            output3,
            "dcb66f3e712f20dc1f22cdeb8afa0219dfcfa7f0c5afab4e919c4e86c4c41cd5"
        );

        Ok(())
    }

    #[test]
    fn sha512_pure_basic_test() -> anyhow::Result<()> {
        let input = "hello world";
        let output = get_str_sha512_pure(input)?;
        assert_eq!(
            output,
            "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f"
        );
        let input2 = "爱拼才会赢";
        let output2 = get_str_sha512_pure(input2)?;
        assert_eq!(
            output2,
            "22f1eb45a50124475c0ca13d3219c5bbba0894e5530e0b59894318e25874ef1c242722f68979fb950315d04cd3750ec1143eb80d1d66bf664398be1399690c67"
        );
        let input3 = "你好🙂啊";
        let output3 = get_str_sha512_pure(input3)?;
        assert_eq!(
            output3,
            "a526e15763e22c34d1cceafeaafe0c45039abe3f285d4f752f965a5f8f7f4e8eb7fcb891ccf2f6c9261dc5d6610539128c321f65b1bd82d7de35a41f4c7cdd4a"
        );

        Ok(())
    }

    #[test]
    fn sha256_with_salt_test() -> anyhow::Result<()> {
        let input = "hello world";
        let salt = "hans666";
        let output = get_str_sha256_with_salt(input, salt)?;
        assert_eq!(
            output,
            "5cc9e7b38b495b7ad80b8b3fa8de50fa125e4121a63fc65b22bd8c0988216057"
        );

        Ok(())
    }

    #[test]
    fn sha512_with_salt_test() -> anyhow::Result<()> {
        let input = "hello world";
        let salt = "hans666";
        let output = get_str_sha512_with_salt(input, salt)?;
        assert_eq!(
            output,
            "95dc0a4b63edaa5740b0f766c79870c1eca45964edfcb1722917e7c609f1836c5fa638b1917991d6d7ce19fdecd73b633d2ee0e58414297cf1c8b69a81b1d459"
        );

        Ok(())
    }

    #[test]
    fn get_sha256_basic_test() -> anyhow::Result<()> {
        let input1 = "hello world";
        let output1 = get_str_sha256(input1)?;
        assert_eq!(
            output1,
            "2379e070457dd223d988bef6ae2c199780a0b3da25aba546980c9ab181ea259c"
        );
        let input2 = "";
        let output2 = get_str_sha256(input2)?;
        assert_eq!(
            output2,
            "8e0a3d50f209e020cd19f458bad94240678157fa58f9a2ebb8b88b4a0757a102"
        );

        Ok(())
    }

    #[test]
    fn get_sha512_basic_test() -> anyhow::Result<()> {
        let input = "hello world";
        let output = get_str_sha512(input)?;
        assert_eq!(
            output,
            "7f979092a6a7cbbd8f64217cec34fb0278bcdcdfc46d99d29af2011a32c0098a17312c738609227b46ad7706a02fbb8d52dc8eab98ae4d8d12dffb6c9fe3b90e"
        );
        let input2 = "";
        let output2 = get_str_sha512(input2)?;
        assert_eq!(
            output2,
            "d52892b96ad0d7d26c99f214f87e610c541995a68eb42800f8a59caa5b379977d3580eb83d3dbce013185ad4f95daffa17615b9b98a44b07570b34b6f1cb5647"
        );

        Ok(())
    }

    #[test]
    fn sha256_with_empty_salt_test() -> anyhow::Result<()> {
        let salt = "";

        let result = get_str_sha256_with_salt("爱拼才会赢", salt)?;
        assert_eq!(
            result,
            "0d57b507c74494cf8575f2ee9dce83cfca85cc97080b7c5691d8b5358afe02b3"
        );

        Ok(())
    }

    #[test]
    fn sha256_with_salt_with_spaces_test() -> anyhow::Result<()> {
        let salt = "hans114514";

        let result11 = get_str_sha256_with_salt("hans7 ", salt)?;
        assert_eq!(
            result11,
            "93c50493f9de9ec171432d0c2b7889a15810c6d69e3592586d4551494790c11c"
        );
        let result12 = get_str_sha256_with_salt("hans7", salt)?;
        assert_eq!(result11, result12);

        let result21 = get_str_sha256_with_salt(" \n\tHANS", salt)?;
        assert_eq!(
            result21,
            "f1f5eb9191c5ef5b5b30fe9de1cfa50bdd8c7a4465bed7704e32849165fa6a07"
        );
        let result22 = get_str_sha256_with_salt("HANS", salt)?;
        assert_eq!(result21, result22);

        let result31 = get_str_sha256_with_salt("  \n  爱拼才会赢 \t", salt)?;
        assert_eq!(
            result31,
            "647f3898d9823174248cbb41aa8018272654b713f8aa30735d0e86ea21450ee9"
        );
        let result32 = get_str_sha256_with_salt("爱拼才会赢", salt)?;
        assert_eq!(result31, result32);

        let result41 = get_str_sha256_with_salt("   有空 格    ", salt)?;
        assert_eq!(
            result41,
            "1b72eb1a07072a54aad35565ea0f1ae0abb29e8fe61a8ccde1acfc64af3cd23a"
        );
        let result42 = get_str_sha256_with_salt("有空 格", salt)?;
        assert_eq!(result41, result42);

        Ok(())
    }

    #[test]
    fn sha512_with_salt_with_spaces_test() -> anyhow::Result<()> {
        let salt = "hans114514";

        let result11 = get_str_sha512_with_salt("hans7 ", salt)?;
        assert_eq!(
            result11,
            "6f38691e89f4b7299f3c2f1e5ad2f69033033ee87e38623a12ec9394e1da01fd2f8b08cdd76885d086dfe5fe677cbdf4820f232ecd33939d2b6286a36ac2424f"
        );
        let result12 = get_str_sha512_with_salt("hans7", salt)?;
        assert_eq!(result11, result12);

        let result21 = get_str_sha512_with_salt(" \n\tHANS", salt)?;
        assert_eq!(
            result21,
            "a4308fc6cdec11d8f2a33ec534945b77fa6a72bed97e71557b52f8840108f2e3587477411878fb2a9d2f5772ab5b8c9948829c1aa4f335ad2b20a898a4d748fa"
        );
        let result22 = get_str_sha512_with_salt("HANS", salt)?;
        assert_eq!(result21, result22);

        let result31 = get_str_sha512_with_salt("  \n  爱拼才会赢 \t", salt)?;
        assert_eq!(
            result31,
            "955999f24a51faa288fe6a981a4b7413cbb162f87fdf606934106b20ec75759f360aa675c4da5216515a517d0252f3f3ee050be1c1fce96dca2d078541f59a3e"
        );
        let result32 = get_str_sha512_with_salt("爱拼才会赢", salt)?;
        assert_eq!(result31, result32);

        let result41 = get_str_sha512_with_salt("   有空 格    ", salt)?;
        assert_eq!(
            result41,
            "a7ef38cf76ed2cca7d76dc97b6dfe2e372c46a09511760417ffa7d3f2d9ad61b353814bbdcf4d793fae2e4be8b37efd047d2017572f78ec6fc152cbbc5b31d0d"
        );
        let result42 = get_str_sha512_with_salt("有空 格", salt)?;
        assert_eq!(result41, result42);

        Ok(())
    }

    #[test]
    fn empty_input_test() {
        // 1. 完全空串
        assert!(get_str_sha256_pure("").is_err());
        assert!(get_str_sha512_pure("").is_err());

        // 2. 仅空格（trim 后变成空串）
        assert!(get_str_sha256_pure(" \t \n  ").is_err());
        assert!(get_str_sha512_pure("  \n \t").is_err());
    }
}
