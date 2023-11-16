import StardustSignerAPI from '../../StardustSignerAPI';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import { ethers } from 'ethers_v6';

export default class EvmStardustSigner {
  public walletId;
  public api: StardustSignerAPI;
  public chainType: ChainType;

  constructor(walletId: string, apiKey: string) {
    this.walletId = walletId;
    this.api = new StardustSignerAPI(apiKey);
    this.chainType = 'evm';
  }

  async signRaw(digest: string | Uint8Array): Promise<string> {
    if (digest instanceof Uint8Array) {
      digest = this.uint8ArrayToHexString(digest);
    }
    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: 'EVM',
      message: digest,
    };

    return await this.api.signMessage(payload);
  }

  async getAddress(): Promise<string> {
    const payload: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: 'EVM',
    };
    return ethers.getAddress(await this.api.getAddress(payload));
  }

  public getPublicKey = async (): Promise<string> => {
    return await this.api.getPublicKey({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  };

  async signMessage(message: string | Uint8Array): Promise<string> {
    if (message instanceof Uint8Array) {
      message = this.uint8ArrayToHexString(message);
    }
    const messagePrefix = '\x19Ethereum Signed Message:\n';
    const messageLen = String(message.length);
    const prefixedMsg = messagePrefix + messageLen + message;

    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: 'EVM',
      message: prefixedMsg,
    };

    return await this.api.signMessage(payload);
  }

  private uint8ArrayToHexString(uint8Array: Uint8Array) {
    return '0x' + uint8Array.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  }
}
