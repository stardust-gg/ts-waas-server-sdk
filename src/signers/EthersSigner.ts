import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Bytes } from '@ethersproject/bytes';
import { Deferrable } from '@ethersproject/properties';
import StardustWallet from '../stardust/StardustWallet';

export default class EthersSigner extends Signer {
  constructor(private stardustWalletId: string, readonly provider?: Provider) {
    super();
  }

  // Returns the checksum address
  async getAddress(): Promise<string> {
    const getAddressPayload = {
      walletId: this.stardustWalletId,
      chainType: 'EVM',
      chainId: await this.getChainId(),
    };
    console.log('getAddressPayload', getAddressPayload);
    return 'ethersAddress';
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  async signMessage(message: Bytes | string): Promise<string> {
    return '0x1234';
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
    return new EthersSigner(this.stardustWalletId, provider);
  }
}
