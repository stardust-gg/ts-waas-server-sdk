import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Bytes } from '@ethersproject/bytes';
import { Deferrable } from '@ethersproject/properties';
import StardustSignerAPI from '../stardust/StardustSignerAPI';
import StardustWallet from '../stardust/StardustWallet';
import { ApiRequestPayload, SignRequestPayload } from '../types';

export default class EthersSigner extends Signer {
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
      chainId: await this.getChainId(),
    };
    return this.stardustSignerAPI.getAddress(payload);
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  async signMessage(message: Bytes | string): Promise<string> {
    const payload: SignRequestPayload = {
      walletId: this.stardustWallet.id,
      chainType: 'EVM',
      chainId: await this.getChainId(),
      digest: message,
    };
    return this.stardustSignerAPI.signMessage(payload);
  }

  // Signs a transaction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    return '0x1234';
  }

  // Returns a new instance of the Signer, connected to provider.
  connect(provider: Provider): EthersSigner {
    return new EthersSigner(this.stardustWallet, provider);
  }
}
