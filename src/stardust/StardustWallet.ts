import EthersSigner from '../signers/EthersSigner';
import PlaceHolderSigner from '../signers/PlaceHolderSigner';
import { Signers } from '../signers/types';

export default class StardustWallet {
  public signers: Signers;

  constructor(public id: string) {
    this.signers = {
      ethers: new EthersSigner(id),
      placeholder: new PlaceHolderSigner(id),
    };
  }
}
