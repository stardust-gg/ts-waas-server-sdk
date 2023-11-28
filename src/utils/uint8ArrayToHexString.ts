export default function uint8ArrayToHexString(uint8Array: Uint8Array) {
  return `0x${uint8Array.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')}`;
}
