import { isHexString } from './isHexString';

export function convertToHex(str: string): string {
  let hexString: string;

  if (isHexString(str)) {
    hexString = str.startsWith('0x') ? str : '0x' + str;
  } else {
    const buffer = Buffer.from(str, 'utf8');
    hexString = buffer.toString('hex');
  }

  return hexString.startsWith('0x') ? hexString : '0x' + hexString;
}
