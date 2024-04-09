import { ethers } from 'ethers_v6';
import StardustSignerAPI from '../StardustSignerAPI';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import AbstractStardustSigner from '../AbstractStardustSigner';
import HexString from '../../../utils/HexString';
import { IsHexString, convertStringToHexString, uint8ArrayToHexString } from '../../../utils';
import PrivatePropertiesManager from '../../../utils/PrivatePropertiesManager';

export default class EvmStardustSigner extends AbstractStardustSigner {
  public walletId;

  public chainType: ChainType;

  constructor(walletId: string, apiKey: string) {
    super();
    this.walletId = walletId;
    this.chainType = 'evm';

    PrivatePropertiesManager.setPrivateProperty(
      this,
      'stardustSignerApi',
      new StardustSignerAPI(apiKey)
    );
  }

  public async signRaw(digest: string | Uint8Array): Promise<string> {
    if (digest instanceof Uint8Array) {
      // eslint-disable-next-line no-param-reassign
      digest = uint8ArrayToHexString(digest);
    }

    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: digest,
    };

    return this.stardustSignerAPI.signMessage(payload);
  }

  public async getAddress(): Promise<string> {
    const payload: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return ethers.getAddress(await this.stardustSignerAPI.getAddress(payload));
  }

  public async getPublicKey(): Promise<string> {
    return this.stardustSignerAPI.getPublicKey({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  }

  public async signMessage(message: string | Uint8Array): Promise<string> {
    const prefixedMsg = this.createPrefixedMessage(message);
    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: prefixedMsg,
    };

    return this.stardustSignerAPI.signMessage(payload);
  }

  public createPrefixedMessage(message: string | Uint8Array): string {
    const messagePrefix = '\x19Ethereum Signed Message:\n';

    let messageContent: string;
    let messageLen: number;

    if (message instanceof Uint8Array) {
      messageContent = uint8ArrayToHexString(message).replace(/^0x/, '');
      messageLen = message.byteLength;
    } else {
      messageContent = IsHexString(message)
        ? message.replace(/^0x/, '')
        : convertStringToHexString(message).replace(/^0x/, '');
      messageLen = messageContent.length / 2; // Byte length for hex string
    }

    const prefixedMessage =
      convertStringToHexString(messagePrefix) +
      new HexString(convertStringToHexString(String(messageLen))).strip() +
      new HexString(messageContent).strip();

    return prefixedMessage;
  }

  get stardustSignerAPI(): StardustSignerAPI {
    return PrivatePropertiesManager.getPrivateProperty<
      this,
      'stardustSignerAPI',
      StardustSignerAPI
    >(this, 'stardustSignerAPI')!;
  }

  set stardustSignerAPI(stardustSignerAPI: StardustSignerAPI) {
    PrivatePropertiesManager.setPrivateProperty(this, 'stardustSignerAPI', stardustSignerAPI);
  }
}
