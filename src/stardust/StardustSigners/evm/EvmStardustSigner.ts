import { ethers } from 'ethers_v6';
import StardustSignerAPI from '../../StardustSignerAPI';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import AbstractStardustSigner from '../AbstractStardustSigner';
import HexString from '../../../utils/HexString';
import { IsHexString, convertStringToHexString, uint8ArrayToHexString } from '../../../utils';

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

  public async signRaw(digest: string | Uint8Array): Promise<string> {
    if (digest instanceof Uint8Array) {
      // eslint-disable-next-line no-param-reassign
      digest = uint8ArrayToHexString(digest);
    }

    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: 'evm',
      message: digest,
    };

    return this.api.signMessage(payload);
  }

  public async getAddress(): Promise<string> {
    const payload: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: 'evm',
    };
    return ethers.getAddress(await this.api.getAddress(payload));
  }

  public async getPublicKey(): Promise<string> {
    return this.api.getPublicKey({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  }

  public async signMessage(message: string | Uint8Array): Promise<string> {
    const messagePrefix = '\x19Ethereum Signed Message:\n';
    let messageLen;
    let prefixedMsg: string;

    if (message instanceof Uint8Array) {
      messageLen = String(message.length);
      // eslint-disable-next-line no-param-reassign
      message = uint8ArrayToHexString(message);
    }

    if (!IsHexString(message)) {
      messageLen = String(new HexString(convertStringToHexString(message as string)).length);
      prefixedMsg = convertStringToHexString(messagePrefix + messageLen + message);
    } else {
      const messageHexString = new HexString(message as string);
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

    return this.api.signMessage(payload);
  }
}
