import { StarkSigner, createStarkSigner, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';
import EthersV5Signer from '../../../ethers/V5/EthersV5Signer';
import AbstractStardustSigner from '../AbstractStardustSigner';

export default class ImxStardustSigner implements AbstractStardustSigner {
  private ethersV5signer: EthersV5Signer;

  constructor(ethersV5Signer: EthersV5Signer) {
    this.ethersV5signer = ethersV5Signer;
  }

  public async getStarkSigner(): Promise<StarkSigner> {
    return createStarkSigner(await this.privateKey());
  }

  private async privateKey() {
    return generateLegacyStarkPrivateKey(this.ethersV5signer);
  }

  public async getPublicKey(): Promise<string> {
    return (await this.getStarkSigner()).getAddress();
  }

  public async getAddress(): Promise<string> {
    return this.getPublicKey();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async signRaw(message: string | Uint8Array): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'not implemented'; // unsupported - imx only uses signMessage and can be accessed via getSigner().signMessage
  }
}
