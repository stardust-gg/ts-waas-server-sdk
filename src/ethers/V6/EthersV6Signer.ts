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
  AbstractSigner,
} from 'ethers_v6';
import { SignRequestPayload } from '../../types';
import EvmStardustSigner from '../../stardust/Signers/evm/EvmStardustSigner';

export default class EthersV6Signer extends AbstractSigner {
  private evmStardustSigner: EvmStardustSigner;

  constructor(evmStardustSigner: EvmStardustSigner, provider: Provider) {
    super(provider);
    this.evmStardustSigner = evmStardustSigner;
  }

  public async getAddress(): Promise<string> {
    return this.evmStardustSigner.getAddress();
  }

  public async signTransaction(tx: ethers.TransactionRequest): Promise<string> {
    // Replace any Addressable or ENS name with an address
    const { to, from } = await resolveProperties({
      to: tx.to ? resolveAddress(tx.to, this.provider) : undefined,
      from: tx.from ? resolveAddress(tx.from, this.provider) : undefined,
    });

    if (to != null) {
      // eslint-disable-next-line no-param-reassign
      tx.to = to;
    }
    if (from != null) {
      // eslint-disable-next-line no-param-reassign
      tx.from = from;
    }

    if (tx.from != null) {
      assertArgument(
        getAddress(<string>tx.from) === (await this.getAddress()),
        'transaction from address mismatch',
        'tx.from',
        tx.from
      );
      // eslint-disable-next-line no-param-reassign
      delete tx.from;
    }

    // Build the transaction
    const builtTx = Transaction.from(<TransactionLike<string>>tx);
    const { unsignedSerialized } = builtTx;

    const payload: SignRequestPayload = {
      walletId: this.evmStardustSigner.walletId,
      chainType: 'evm',
      message: unsignedSerialized,
    };
    const signature = await this.evmStardustSigner.stardustSignerAPI.signTransaction(payload);
    builtTx.signature = signature;
    return builtTx.serialized;
  }

  public async signMessage(message: string | Uint8Array): Promise<string> {
    return this.evmStardustSigner.signMessage(message);
  }

  public async signTypedData(
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
      chainType: 'evm',
      message: encodedTypedData,
    };

    const sig = await this.evmStardustSigner.stardustSignerAPI.signTransaction(payload);
    const splitSig = ethers.Signature.from(sig);
    return ethers.Signature.from(splitSig).serialized;
  }

  public connect(provider: Provider): EthersV6Signer {
    return new EthersV6Signer(this.evmStardustSigner, provider);
  }
}
