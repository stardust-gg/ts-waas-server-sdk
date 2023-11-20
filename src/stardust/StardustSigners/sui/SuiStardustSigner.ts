import { convertToHex } from '../../../index';
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

  public signRaw = async (message: string | Uint8Array): Promise<string> => {
    const hexString = this.sanitizeMessage(message);
    const params: SignRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
      message: hexString,
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

  private sanitizeMessage = (message: string | Uint8Array): string => {
    // If message is a string and is already a hex string, return it as is
    if (typeof message === 'string') {
      return convertToHex(message);
    }

    // Otherwise, convert message to a Buffer and then to a hex string - works for utf 8 and uint8array
    const hexString = '0x' + Buffer.from(message).toString('hex');
    return hexString;
  };
}
