/* eslint-disable no-unused-vars */
import { createStarkSigner, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';
import SuiKeyPair from './KeyPair/sui/SuiKeyPair';
import ImxKeyPair from './KeyPair/imx/ImxKeyPair';
import EthersV5Signer from '../ethers/V5/EthersV5Signer';

export default class StardustWallet {
  public ethers: {
    v5: {
      signer: EthersV5Signer;
    };
  };
  public sui: SuiKeyPair;
  public imx: ImxKeyPair;

  constructor(
    public readonly id: string,
    public readonly apiKey: string,
    public readonly createdAt: Date,
    public readonly lastUsedAt: Date | null = null
  ) {
    this.ethers = {
      v5: {
        signer: new EthersV5Signer(this),
      },
    };

    this.sui = new SuiKeyPair(id, apiKey);
    this.imx = new ImxKeyPair(this.ethers.v5.signer, id, apiKey);
  }
}
