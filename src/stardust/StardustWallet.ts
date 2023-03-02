import axios from 'axios';

export default class StardustWallet {
  readonly _name: string = 'StardustWallet';
  private constructor(
    private readonly _url: string,
    private readonly _apiKey: string,
    public readonly id: string
  ) {}

  static async create(url: string, apiKey: string): Promise<StardustWallet> {
    const response = await axios.post(`${url}/wallet`, null, { headers: { 'x-api-key': apiKey } });
    const { id } = response.data;
    return new StardustWallet(url, apiKey, id);
  }
}
