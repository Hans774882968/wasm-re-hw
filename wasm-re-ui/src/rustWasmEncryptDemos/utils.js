export function getToastErrorInfo(e) {
  const strE = e.toString();
  if (strE.includes('Invalid Base64')) return '密文格式不正确';
  if (strE.includes('Invalid UTF-8')) return '不是合法的UTF-8字符串';
  return '解密时出错';
}

export function toU8(s) {
  return new TextEncoder().encode(s);
}
