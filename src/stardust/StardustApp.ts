import axios, { HttpStatusCode } from 'axios';
import StardustWallet from './StardustWallet';

export default class StardustApp {
  private constructor(
    private readonly _apiKey: string,
    private readonly _url: string,
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly description: string | null
  ) {
    const appParams = { _apiKey, id, _url, name, email, description };
  }

  public static async create(
    url: string,
    name: string,
    email: string,
    description: string | null
  ): Promise<{ stardustApp: StardustApp; apiKey: string }> {
    const response = await axios.post(`${url}/application`, { name, email, description });
    if (response.status !== HttpStatusCode.Created) throw new Error('Failed to create app');
    const { apiKeys, id: appId } = response.data;
    const stardustApp = new StardustApp(apiKeys[0], url, appId, name, email, description);
    return { stardustApp, apiKey: apiKeys[0] };
  }

  public static async get(url: string, apiKey: string): Promise<StardustApp> {
    const response = await axios.get(`${url}/application`, { headers: { 'x-api-key': apiKey } });
    const { name, email, description, id: appId } = response.data;
    return new StardustApp(apiKey, url, appId, name, email, description);
  }

  public async createWallet(): Promise<StardustWallet> {
    return StardustWallet.create(this._url, this._apiKey);
  }
}
