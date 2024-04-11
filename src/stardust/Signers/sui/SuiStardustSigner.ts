import { IntentScope, messageWithIntent } from '@mysten/sui.js/cryptography';
import { blake2b } from '@noble/hashes/blake2b';
import { uint8ArrayToHexString } from '../../../utils';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import StardustSignerAPI from '../StardustSignerAPI';
import AbstractStardustSigner from '../AbstractStardustSigner';

export default class SuiStardustSigner implements AbstractStardustSigner {
  public walletId;

  public chainType: ChainType;

  public stardustSignerAPI: StardustSignerAPI;

  constructor(id: string, apiKey: string) {
    this.walletId = id;
    this.chainType = 'sui';
    this.stardustSignerAPI = new StardustSignerAPI(apiKey);
  }

  public async getPublicKey(): Promise<string> {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return this.stardustSignerAPI.getPublicKey(params);
  }

  public async signRaw(digest: string | Uint8Array): Promise<string> {
    if (digest instanceof Uint8Array) {
      // eslint-disable-next-line no-param-reassign
      digest = uint8ArrayToHexString(digest);
    }

    const params: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: digest,
    };
    return String(await this.stardustSignerAPI.signMessage(params));
  }

  public async signTransactionBlock(builtTx: Uint8Array): Promise<string> {
    const intentMessage = messageWithIntent(IntentScope.TransactionData, builtTx);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    return this.signRaw(digest);
  }

  public async signPersonalMessage(message: Uint8Array): Promise<string> {
    const serializedMessage = new Uint8Array(message.length + 1);
    serializedMessage[0] = message.length;
    serializedMessage.set(message, 1);
    const intentMessage = messageWithIntent(IntentScope.PersonalMessage, serializedMessage);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    return this.signRaw(digest);
  }

  public async getAddress(): Promise<string> {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return this.stardustSignerAPI.getAddress(params);
  }

  public toJson() {
    return {
      walletId: this.walletId,
      chainType: this.chainType,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}
