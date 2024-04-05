import StardustSignerAPI from '../StardustSignerAPI';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import AbstractStardustSigner from '../AbstractStardustSigner';
import { convertStringToHexString, IsHexString, uint8ArrayToHexString } from '../../../utils';

export default class SolStardustSigner extends AbstractStardustSigner {
  public walletId;

  public api: StardustSignerAPI;

  public chainType: ChainType;

  constructor(walletId: string, apiKey: string) {
    super();
    this.walletId = walletId;
    this.api = new StardustSignerAPI(apiKey);
    this.chainType = 'sol';
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

    return this.api.signMessage(payload);
  }

  public async getAddress(): Promise<string> {
    const payload: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return this.api.getAddress(payload);
  }

  public async getPublicKey(): Promise<string> {
    return this.api.getPublicKey({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  }

  public async signMessage(message: string | Uint8Array): Promise<string> {
    const parsedMessage = this.parseMessage(message);
    const payload: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: parsedMessage,
    };

    return this.api.signMessage(payload);
  }

  private parseMessage(message: string | Uint8Array): string {
    let messageContent: string;
    if (message instanceof Uint8Array) {
      messageContent = uint8ArrayToHexString(message);
    } else {
      messageContent = IsHexString(message)
        ? message.replace(/^0x/, '')
        : convertStringToHexString(message);
    }
    return messageContent;
  }
}
