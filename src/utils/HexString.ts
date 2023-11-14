export default class HexString {
  private readonly value!: `0x${string}`;

  constructor(value: `0x${string}` | HexString | string | Buffer | bigint) {
    if (typeof value === 'bigint') {
      this.value = HexString.addHexPrefix(value.toString(16));
    } else if (value instanceof Buffer) {
      this.value = HexString.addHexPrefix(value.toString('hex'));
    } else if (value instanceof HexString) {
      this.value = value.value;
    } else {
      this.value = HexString.addHexPrefix(value);
    }
  }

  public toString<T extends 'strip' | 'prefix'>(mutate: T, padding = 0): string {
    if (mutate === 'strip') {
      return this.strip(padding);
    }
    return this.prefix(padding);
  }

  public static normalizeHex(value: string): string {
    return value.length % 2 === 0 ? value : `0${value.replace(/^0x/, '')}`;
  }

  public static addPadding(value: string, padding: number): string {
    return value.padStart(padding, '0');
  }

  public strip(padding = 0): string {
    const normalizedValue = HexString.normalizeHex(this.value);
    const strippedValue = normalizedValue.replace(/^0x/, '');
    return HexString.addPadding(strippedValue, padding);
  }

  public prefix(padding = 0): string {
    const normalizedValue = HexString.normalizeHex(this.value);
    const strippedValue = normalizedValue.replace(/^0x/, '');
    const paddedValue = HexString.addPadding(strippedValue, padding);
    return `0x${paddedValue}`;
  }

  get Uint8Array(): Uint8Array {
    return new Uint8Array(this.buffer);
  }

  get buffer(): Buffer {
    return Buffer.from(this.strip(), 'hex');
  }

  public toJSON(): string {
    return this.value;
  }

  get bigInt(): bigint {
    return BigInt(this.prefix());
  }

  static addHexPrefix = (str: string): `0x${string}` =>
    (str.startsWith('0x') ? str : `0x${str}`) as `0x${string}`;
}
