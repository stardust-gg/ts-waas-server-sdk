import EthersV5Signer from '../../../ethers/V5/EthersV5Signer';
import { StarkSigner, createStarkSigner, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';
import EvmStardustSigner from '../evm/EvmStardustSigner';
import AbstractStardustSigner from '../AbstractStardustSigner';

export default class ImxStardustSigner implements AbstractStardustSigner {
  private ethersV5signer: EthersV5Signer;

  constructor(ethersV5Signer: EthersV5Signer) {
    this.ethersV5signer = ethersV5Signer;
  }

  public getSigner = async (signer: EthersV5Signer): Promise<StarkSigner> => {
    return createStarkSigner(await this.privateKey());
  };

  private privateKey = async () => {
    return await generateLegacyStarkPrivateKey(this.ethersV5signer);
  };

  public getPublicKey: () => Promise<string> = async () => {
    throw 'not implemented';
  };

  public getAddress = async (): Promise<string> => {
    throw 'not implemented';
  };

  public signRaw = async (message: string | Uint8Array): Promise<string> => {
    throw 'not implemented';
  };
}
