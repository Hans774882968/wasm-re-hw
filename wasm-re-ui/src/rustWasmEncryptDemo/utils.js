export function getToastErrorInfo(e) {
  const strE = e.toString();
  if(strE.includes('Invalid Base64')) return '密文格式不正确';
  if(strE.includes('Invalid UTF-8')) return '密文格式不正确';
  return '解密时出错';
}
