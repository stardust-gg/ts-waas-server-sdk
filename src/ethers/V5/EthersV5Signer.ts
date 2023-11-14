import { Signer } from '@ethersproject/abstract-signer';
import { joinSignature } from '@ethersproject/bytes';
import { Deferrable, resolveProperties } from '@ethersproject/properties';
import { serialize, UnsignedTransaction } from '@ethersproject/transactions';
import StardustSignerAPI from '../../stardust/StardustSignerAPI';
import StardustWallet from '../../stardust/StardustWallet';
import type { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import type { Bytes, Signature } from '@ethersproject/bytes';
import type { ApiRequestPayload, SignRequestPayload } from '../../types';
import { sign } from 'crypto';

export default class EthersV5Signer extends Signer {
  private stardustSignerAPI: StardustSignerAPI;

  private stardustWallet: StardustWallet;

  readonly provider?: Provider;

  constructor(stardustWallet: StardustWallet, provider?: Provider) {
    super();
    this.stardustWallet = stardustWallet;
    this.provider = provider;
    this.stardustSignerAPI = new StardustSignerAPI(stardustWallet.apiKey);
  }

  // Returns the checksum address
  async getAddress(): Promise<string> {
    const payload: ApiRequestPayload = {
      walletId: this.stardustWallet.id,
      chainType: 'EVM',
    };
    return this.stardustSignerAPI.getAddress(payload);
  }

  async signRaw(message: Bytes | string): Promise<string> {
    const payload: SignRequestPayload = {
      walletId: this.stardustWallet.id,
      chainType: 'EVM',
      message,
    };

    return await this.stardustSignerAPI.signMessage(payload);
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  async signMessage(message: string): Promise<string> {
    const messagePrefix = '\x19Ethereum Signed Message:\n';
    const messageLen = String(message.length);
    const prefixedMsg = messagePrefix + messageLen + message;

    const payload: SignRequestPayload = {
      walletId: this.stardustWallet.id,
      chainType: 'EVM',
      message: prefixedMsg,
    };

    return await this.stardustSignerAPI.signMessage(payload);
  }

  // Signs a transaction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    const tx = await resolveProperties(transaction);
    if (tx.from) {
      if (tx.from !== (await this.getAddress())) {
        throw new Error('from address mismatch');
      }
      delete tx.from;
    }
    const message = serialize(<UnsignedTransaction>tx);
    const payload: SignRequestPayload = {
      walletId: this.stardustWallet.id,
      chainType: 'EVM',
      message,
    };
    const signature = await this.stardustSignerAPI.signTransaction(payload);
    return serialize(<UnsignedTransaction>tx, signature);
  }

  // Returns a new instance of the Signer, connected to provider.
  connect(provider: Provider): EthersV5Signer {
    return new EthersV5Signer(this.stardustWallet, provider);
  }
}
