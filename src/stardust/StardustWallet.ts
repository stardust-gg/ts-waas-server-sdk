import EthersSigner from '../signers/EthersSigner';
import PlaceHolderSigner from '../signers/PlaceHolderSigner';
import { Signers } from '../types';

export default class StardustWallet {
  public signers: Signers;

  constructor(
    public readonly id: string,
    public readonly apiKey: string,
    public readonly createdAt: Date,
    public readonly lastUsedAt: Date | null = null
  ) {
    this.signers = {
      ethers: new EthersSigner(this),
      placeholder: new PlaceHolderSigner(this.id),
    };
  }
}
