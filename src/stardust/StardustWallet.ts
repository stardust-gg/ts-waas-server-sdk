import axios from 'axios';
import StardustApp from './StardustApp';

export default class StardustWallet {
  readonly _name: string = 'StardustWallet';
  private constructor(
    private readonly _parent: StardustApp,
    public readonly id: string
  ) {}

  static async create(parent: StardustApp): Promise<StardustWallet> {
    const response = await axios.post(`${parent.getUrl()}/wallet`, null, { headers: { 'x-api-key': parent.getApiKey() } });
    const { id } = response.data;
    return new StardustWallet(parent, id);
  }
}
