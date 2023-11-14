import { convertToHex } from '../../../index';
import AbstractStardustKeyPair from '../AbstractStardustKeyPair';
import { ApiRequestPayload, SignRequestPayload } from '../../../types';
import { IntentScope, messageWithIntent } from '@mysten/sui.js/cryptography';
import { blake2b } from '@noble/hashes/blake2b';
import StardustSignerAPI from '../../StardustSignerAPI';
import { bcs } from '@mysten/sui.js/bcs';

type SuiChainType = 'sui';

export default class SuiKeyPair implements AbstractStardustKeyPair {
  public walletId;
  public api: StardustSignerAPI;
  public chainType: SuiChainType;

  constructor(id: string, apiKey: string) {
    this.walletId = id;
    this.api = new StardustSignerAPI(apiKey);
    this.chainType = 'sui';
  }

  public publicKey = async (): Promise<string> => {
    const params: ApiRequestPayload = {
      walletId: this.walletId,
      chainType: this.chainType,
    };
    return await this.api.getPublicKey(params);
  };

  public sign = async (message: string | Uint8Array): Promise<string> => {
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
    return await this.sign(digest);
  };

  public signPersonalMessage = async (message: Uint8Array): Promise<string> => {
    const serializedMessage = bcs.vector(bcs.u8()).serialize(message).toBytes(); // sui sdk magic
    const intentMessage = messageWithIntent(IntentScope.PersonalMessage, serializedMessage);
    const digest = blake2b(intentMessage, { dkLen: 32 });
    return await this.sign(digest);
  };

  public address = async (): Promise<string> => {
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
