import EthersV5Signer from '../../../ethers/V5/EthersV5Signer';
import { StarkSigner, createStarkSigner, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';
import StardustSignerAPI from '../../StardustSignerAPI';
import { ChainType } from '../../../types';

export default class ImxKeyPair {
  public walletId;
  public api: StardustSignerAPI;
  public chainType: ChainType;

  constructor(private readonly signer: EthersV5Signer, waleltId: string, apiKey: string) {
    this.walletId = waleltId;
    this.api = new StardustSignerAPI(apiKey);
    this.chainType = 'evm';
  }

  public getSigner = async (): Promise<StarkSigner> => {
    return createStarkSigner(await generateLegacyStarkPrivateKey(this.signer));
  };

  public getPublicKey = async (): Promise<string> => {
    return await this.api.getPublicKey({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  };

  public getAddress = async (): Promise<string> => {
    return await this.api.getAddress({
      walletId: this.walletId,
      chainType: this.chainType,
    });
  };
}
