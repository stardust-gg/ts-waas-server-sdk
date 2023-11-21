import { isHexString } from './isHexString';

export function convertStringToHex(str: string): string {
  let hexString: string;

  if (isHexString(str)) {
    hexString = str;
  } else {
    const buffer = Buffer.from(str, 'utf8');
    hexString = '0x' + buffer.toString('hex');
  }

  return hexString;
}
