export function isHexString(str: string) {
  const hexRegex = /^0x[a-fA-F0-9]+$/;
  return hexRegex.test(str);
}
