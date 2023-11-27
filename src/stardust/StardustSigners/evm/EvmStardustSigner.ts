import StardustSignerAPI from '../../StardustSignerAPI';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import { ethers } from 'ethers_v6';
import AbstractStardustSigner from '../AbstractStardustSigner';
import HexString from '../../../utils/HexString';
import { convertStringToHexString, isHexString, uint8ArrayToHexString } from '../../../utils';

export default class EvmStardustSigner extends AbstractStardustSigner {
  public walletId;
  public api: StardustSignerAPI;
  public chainType: ChainType;

  constructor(walletId: string, apiKey: string) {
    super();
    this.walletId = walletId;
    this.api = new StardustSignerAPI(apiKey);
    this.chainType = 'evm';
  }

  public signRaw = async (digest: string | Uint8Array): Promise<string> => {
    if (digest instanceof Uint8Array) {
      digest = uint8ArrayToHexString(digest);
    }

    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: 'evm',
      message: digest,
    };

    return await this.api.signMessage(payload);
  };

  public getAddress = async (): Promise<string> => {
    const payload: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: 'evm',
    };
    return ethers.getAddress(await this.api.getAddress(payload));
  };

  public getPublicKey = async (): Promise<string> => {
    return await this.api.getPublicKey({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  };

  async signMessage(message: string | Uint8Array): Promise<string> {
    const messagePrefix = '\x19Ethereum Signed Message:\n';
    let messageLen;
    let prefixedMsg: string;

    if (message instanceof Uint8Array) {
      messageLen = String(message.length);
      message = uint8ArrayToHexString(message);
    }

    if (!isHexString(message)) {
      messageLen = String(new HexString(convertStringToHexString(message)).length);
      prefixedMsg = convertStringToHexString(messagePrefix + messageLen + message);
    } else {
      const messageHexString = new HexString(message);
      messageLen = String(messageHexString.length);
      prefixedMsg =
        convertStringToHexString(messagePrefix) +
        new HexString(convertStringToHexString(messageLen)).strip() +
        messageHexString.strip();
    }

    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: 'evm',
      message: prefixedMsg,
    };

    return await this.api.signMessage(payload);
  }
}
