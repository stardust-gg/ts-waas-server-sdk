import {
  Provider,
  Transaction,
  TransactionLike,
  TypedDataEncoder,
  assertArgument,
  ethers,
  getAddress,
  resolveAddress,
  resolveProperties,
  assert,
} from 'ethers_v6';
import { AbstractSigner } from 'ethers_v6';
import { SignRequestPayload } from '../../types';
import EvmStardustSigner from '../../stardust/StardustSigners/evm/EvmStardustSigner';

export default class EthersV6Signer extends AbstractSigner {
  private evmStardustSigner: EvmStardustSigner;

  constructor(evmStardustSigner: EvmStardustSigner, provider: Provider) {
    super(provider);
    this.evmStardustSigner = evmStardustSigner;
  }

  connect(provider: Provider): EthersV6Signer {
    return new EthersV6Signer(this.evmStardustSigner, provider);
  }

  async getAddress(): Promise<string> {
    return this.evmStardustSigner.getAddress();
  }

  async signTransaction(tx: ethers.TransactionRequest): Promise<string> {
    // Replace any Addressable or ENS name with an address
    const { to, from } = await resolveProperties({
      to: tx.to ? resolveAddress(tx.to, this.provider) : undefined,
      from: tx.from ? resolveAddress(tx.from, this.provider) : undefined,
    });

    if (to != null) {
      tx.to = to;
    }
    if (from != null) {
      tx.from = from;
    }

    if (tx.from != null) {
      assertArgument(
        getAddress(<string>tx.from) === (await this.getAddress()),
        'transaction from address mismatch',
        'tx.from',
        tx.from
      );
      delete tx.from;
    }

    // Build the transaction
    const builtTx = Transaction.from(<TransactionLike<string>>tx);
    const unsignedHash = builtTx.unsignedHash;

    const payload: SignRequestPayload = {
      walletId: this.evmStardustSigner.walletId,
      chainType: 'EVM',
      message: unsignedHash,
    };
    const signature = await this.evmStardustSigner.api.signTransaction(payload);
    builtTx.signature = signature;
    return builtTx.serialized;
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    return this.evmStardustSigner.signMessage(message);
  }

  async signTypedData(
    domain: ethers.TypedDataDomain,
    types: Record<string, ethers.TypedDataField[]>,
    value: Record<string, any>
  ): Promise<string> {
    const populated = await TypedDataEncoder.resolveNames(
      domain,
      types,
      value,
      async (name: string) => {
        assert(
          this.provider != null,
          'cannot resolve ENS names without a provider',
          'UNSUPPORTED_OPERATION',
          {
            operation: 'resolveName',
            info: { name },
          }
        );

        const address = await this.provider!.resolveName(name);
        assert(address != null, 'unconfigured ENS name', 'UNCONFIGURED_NAME', {
          value: name,
        });

        return address;
      }
    );

    const encodedTypedData = TypedDataEncoder.encode(populated.domain, types, populated.value);

    const payload: SignRequestPayload = {
      walletId: this.evmStardustSigner.walletId,
      chainType: 'EVM',
      message: encodedTypedData,
    };

    const sig = await this.evmStardustSigner.api.signMessage(payload);
    const splitSig = ethers.Signature.from(sig);
    return ethers.Signature.from(splitSig).serialized;
  }
}
