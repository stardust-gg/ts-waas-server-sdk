import { convertToHex } from '../../../utils/convertStringtoHex';
import { AbstractStardustKeyPair } from '../AbstractStardustKeyPair';
import AbstractStardustAPI from '../../AbstractStardustAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../../types';

type SigningScheme = 'ed25519' | 'secp256k1' | 'secp256r1';
type SuiChainType = 'sui-ed25519' | 'sui-secp256k1' | 'sui-secp256r1';

export default class SuiKeyPair implements AbstractStardustKeyPair {
  public walletId;
  public api: AbstractStardustAPI;

  public chainType: SuiChainType;

  constructor(id: string, apiKey: string, private readonly signingScheme: SigningScheme) {
    this.walletId = id;
    this.api = new AbstractStardustAPI(apiKey);

    switch (signingScheme) {
      case 'ed25519':
        this.chainType = 'sui-ed25519';
        break;
      case 'secp256k1':
        this.chainType = 'sui-secp256k1';
        break;
      case 'secp256r1':
        this.chainType = 'sui-secp256r1';
        break;
      default:
        throw new Error(`Unsupported signing scheme ${signingScheme}`);
    }
  }

  publicKey = async (): Promise<string> => {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return this.api.apiGet(`wallet/public-key`, params);
  };

  sign = async (message: string | Uint8Array): Promise<string> => {
    const hexString = this.sanitizeMessage(message);
    const params: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: hexString,
    };
    return this.api.apiPost(`sign/message`, params);
  };

  address = async (): Promise<string> => {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return this.api.apiGet(`wallet/address`, params);
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
