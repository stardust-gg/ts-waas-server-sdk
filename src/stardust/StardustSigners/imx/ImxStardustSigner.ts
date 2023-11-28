import EthersV5Signer from '../../../ethers/V5/EthersV5Signer';
import { StarkSigner, createStarkSigner, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';
import EvmStardustSigner from '../evm/EvmStardustSigner';
import AbstractStardustSigner from '../AbstractStardustSigner';

export default class ImxStardustSigner implements AbstractStardustSigner {
  private ethersV5signer: EthersV5Signer;

  constructor(ethersV5Signer: EthersV5Signer) {
    this.ethersV5signer = ethersV5Signer;
  }

  public getStarkSigner = async (): Promise<StarkSigner> => {
    return await createStarkSigner(await this.privateKey());
  };

  private privateKey = async () => {
    return await generateLegacyStarkPrivateKey(this.ethersV5signer);
  };

  public getPublicKey: () => Promise<string> = async () => {
    return await (await this.getStarkSigner()).getAddress();
  };

  public getAddress = async (): Promise<string> => {
    return this.getPublicKey();
  };

  public signRaw = async (message: string | Uint8Array): Promise<string> => {
    throw 'not implemented'; // unsupported - imx only uses signMessage and can be accessed via getSigner().signMessage
  };
}
