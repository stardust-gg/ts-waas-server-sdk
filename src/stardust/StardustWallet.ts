import axios from 'axios';
import StardustApp from './StardustApp';
import { Signers } from '../signers/types';
import EthersSigner from '../signers/EthersSigner';
import PlaceHolderSigner from '../signers/PlaceHolderSigner';

export default class StardustWallet {
  readonly _name: string = 'StardustWallet';
  private readonly _parent: StardustApp;
  public readonly signers: Signers;
  public readonly id: string;

  private constructor(_parent: StardustApp, id: string) {
    this._parent = _parent;
    this.id = id;
    this.signers = { 
      ethers: new EthersSigner(this.id), 
      placeholder: new PlaceHolderSigner(this.id) 
    };
  }

  static async create(parent: StardustApp): Promise<StardustWallet> {
    const response = await axios.post(`${parent.getUrl()}/wallet`, null, {
      headers: { 'x-api-key': parent.getApiKey() },
    });
    const { id } = response.data;
    return new StardustWallet(parent, id);
  }
}
