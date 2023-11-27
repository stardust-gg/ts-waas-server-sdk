import { convertStringToHexString } from './convertStringToHexString';
import { uint8ArrayToHexString } from './uint8ArrayToHexString';

export function convertToHex(input: string | Uint8Array): string {
  if (typeof input === 'string') {
    return convertStringToHexString(input);
  } else {
    return uint8ArrayToHexString(input);
  }
}
