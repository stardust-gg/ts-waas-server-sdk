import { Signer } from '@ethersproject/abstract-signer';
import { Deferrable, resolveProperties } from '@ethersproject/properties';
import { serialize, UnsignedTransaction } from '@ethersproject/transactions';
import type { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignRequestPayload } from '../../types';
import EvmStardustSigner from '../../stardust/StardustSigners/evm/EvmStardustSigner';
export default class EthersV5Signer extends Signer {
  private evmStardustSigner: EvmStardustSigner;
  readonly provider?: Provider;

  constructor(evmStardustSigner: EvmStardustSigner, provider?: Provider) {
    super();
    this.evmStardustSigner = evmStardustSigner;
    this.provider = provider;
  }

  async getAddress(): Promise<string> {
    return this.evmStardustSigner.getAddress();
  }

  async signMessage(message: string): Promise<string> {
    return this.evmStardustSigner.signMessage(message);
  }

  async signRaw(message: string | Uint8Array): Promise<string> {
    return this.evmStardustSigner.signRaw(message);
  }

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
      walletId: this.evmStardustSigner.walletId,
      chainType: 'evm',
      message,
    };
    const signature = await this.evmStardustSigner.api.signTransaction(payload);
    return serialize(<UnsignedTransaction>tx, signature);
  }

  connect(provider: Provider): EthersV5Signer {
    return new EthersV5Signer(this.evmStardustSigner, provider);
  }
}
