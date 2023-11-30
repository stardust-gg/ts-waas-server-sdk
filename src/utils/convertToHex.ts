import convertStringToHexString from './convertStringToHexString';
import uint8ArrayToHexString from './uint8ArrayToHexString';

export default function convertToHex(input: string | Uint8Array): string {
  if (typeof input === 'string') {
    return convertStringToHexString(input);
  }
  return uint8ArrayToHexString(input);
}
