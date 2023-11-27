import { convertToHex, uint8ArrayToHexString } from '../../../utils';
import { ApiRequestPayload, ChainType, SignRequestPayload } from '../../../types';
import { IntentScope, messageWithIntent } from '@mysten/sui.js/cryptography';
import { blake2b } from '@noble/hashes/blake2b';
import StardustSignerAPI from '../../StardustSignerAPI';
import AbstractStardustSigner from '../AbstractStardustSigner';

export default class SuiStardustSigner implements AbstractStardustSigner {
  public walletId;
  public api: StardustSignerAPI;
  public chainType: ChainType;

  constructor(id: string, apiKey: string) {
    this.walletId = id;
    this.api = new StardustSignerAPI(apiKey);
    this.chainType = 'sui';
  }

  public getPublicKey = async (): Promise<string> => {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return await this.api.getPublicKey(params);
  };

  public signRaw = async (digest: string | Uint8Array): Promise<string> => {
    if (digest instanceof Uint8Array) {
      digest = uint8ArrayToHexString(digest);
    }

    const params: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: digest,
    };
    return String(await this.api.signMessage(params));
  };

  public signTransactionBlock = async (builtTx: Uint8Array): Promise<string> => {
    const intentMessage = messageWithIntent(IntentScope.TransactionData, builtTx);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    return await this.signRaw(digest);
  };

  public signPersonalMessage = async (message: Uint8Array): Promise<string> => {
    const serializedMessage = new Uint8Array(message.length + 1);
    serializedMessage[0] = message.length;
    serializedMessage.set(message, 1);
    const intentMessage = messageWithIntent(IntentScope.PersonalMessage, serializedMessage);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    return await this.signRaw(digest);
  };

  public getAddress = async (): Promise<string> => {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return await this.api.getAddress(params);
  };
}
