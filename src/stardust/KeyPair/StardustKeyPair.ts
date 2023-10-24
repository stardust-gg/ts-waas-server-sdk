import StardustWallet from '../StardustWallet';
import StardustAppAPI from '../StardustAppAPI';
import { isHexString } from '../../utils/isHexString';
import { convertToHex } from '../../utils/convertStringtoHex';

type SigningScheme = 'ed25519' | 'secp256k1' | 'secp256r1';

export default class StardustKeyPair {
  public walletId;
  public api: StardustAppAPI;

  constructor(id: string, apiKey: string, private readonly signingScheme: SigningScheme) {
    this.walletId = id;
    this.api = new StardustAppAPI(apiKey);

    switch (signingScheme) {
      case 'ed25519':
      case 'secp256k1':
      case 'secp256r1':
        break;
      default:
        throw new Error(`Unsupported signing scheme ${signingScheme}`);
    }
  }

  publicKey = async (): Promise<string> => {
    return this.api.apiGet(`wallet/${this.walletId}/public-key/${this.signingScheme}`);
  };

  sign = async (message: string | Uint8Array): Promise<string> => {
    const hexString = this.sanitizeMessage(message);

    return this.api.apiPost(`wallet/${this.walletId}/sign/${this.signingScheme}`, {
      message: hexString,
    });
  };

  sanitizeMessage = (message: string | Uint8Array): string => {
    // If message is a string and is already a hex string, return it as is
    if (typeof message === 'string') {
      return convertToHex(message);
    }

    // Otherwise, convert message to a Buffer and then to a hex string - works for utf 8 and uint8array
    const hexString = '0x' + Buffer.from(message).toString('hex');
    return hexString;
  };
}
