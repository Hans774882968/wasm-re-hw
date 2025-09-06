pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

pub fn greeting(name: &str, age: u32) -> String {
    format!("Hello, {}. 你好，{}。你{}岁了。", name, name, age)
}

pub fn string_add_demo(name: &str, age: u32) -> String {
    let mut s = String::from("你好");
    s.push('，');
    s.push_str(name);
    s.push_str("。你");
    s.push_str(age.to_string().as_str());
    s.push_str("岁了~");
    s
}

pub fn string_replace_demo(s: &str, from: &str) -> String {
    let part1 = s.replace(from, "love");
    let part2 = s.replacen(from, "love", 1);
    part1 + "; " + &part2 // 只是展示字符串拼接的一种写法，实际上用 format! 更好
}

pub fn arr_square_sum_demo(arr: &[u32]) -> u32 {
    let mut sum = 0;
    for v in arr {
        sum += v * v;
    }
    sum
}

/**
 * fields `active`, `username`, `email`, and `sign_in_count` are never read
 * `#[warn(dead_code)]` on by default
 * 加 #[allow(dead_code)] 或者给每个字段都加上 pub 都可以镇压
 */
#[allow(dead_code)]
pub struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}

pub fn build_another_user_demo() -> User {
    let user1 = build_user(String::from("hans7@example.com"), String::from("hans7"));

    let user2 = User {
        email: String::from("hans7-2@example.com"),
        ..user1
    };

    user2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn greeting_test() {
        let result = greeting("hans7", 18);
        assert_eq!(result, "Hello, hans7. 你好，hans7。你18岁了。");
    }

    #[test]
    fn string_add_test() {
        let result = string_add_demo("hans7", 18);
        assert_eq!(result, "你好，hans7。你18岁了~");
    }

    #[test]
    fn string_replace_test() {
        let result = string_replace_demo("fxxk you, fxxk him", "fxxk");
        assert_eq!(result, "love you, love him; love you, fxxk him");
    }

    #[test]
    fn arr_square_sum_test() {
        let result = arr_square_sum_demo(&[9, 8, 7, 6, 5]);
        assert_eq!(result, 255);
    }

    #[test]
    fn build_another_user_test() {
        let result = build_another_user_demo();
        assert_eq!(result.username, "hans7");
        assert_eq!(result.email, "hans7-2@example.com");
        assert_eq!(result.active, true);
        assert_eq!(result.sign_in_count, 1);
    }
}
