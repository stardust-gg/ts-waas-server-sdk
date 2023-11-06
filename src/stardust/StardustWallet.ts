/* eslint-disable no-unused-vars */
import EthersSigner from '../signers/EthersSigner';
import StardustKeyPair from './KeyPair/AbstractStardustKeyPair';
import SuiKeyPair from './KeyPair/sui/SuiKeyPair';

type StardustKeyPairs = {
  [key: string]: StardustKeyPair;
};

export default class StardustWallet {
  public signers: { ethers: EthersSigner };

  public sui: StardustKeyPairs;

  constructor(
    public readonly id: string,
    public readonly apiKey: string,
    public readonly createdAt: Date,
    public readonly lastUsedAt: Date | null = null
  ) {
    this.signers = {
      ethers: new EthersSigner(this),
    };

    this.sui = {
      ed25519: new SuiKeyPair(id, apiKey, 'ed25519'),
    };
  }
}
