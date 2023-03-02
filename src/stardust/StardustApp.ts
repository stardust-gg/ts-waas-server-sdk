import axios, { HttpStatusCode } from 'axios';

export default class StardustApp {
  private constructor(
    private readonly _apiKey: string,
    private readonly _appId: string,
    private readonly _url: string,
    private _name: string,
    private _email: string,
    private _description: string | null
  ) {
    const appParams = { _apiKey, _appId, _url, _name, _email, _description };
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
    const stardustApp = new StardustApp(apiKeys[0], appId, url, name, email, description);
    return { stardustApp, apiKey: apiKeys[0] };
  }

  public static async get(url: string, apiKey: string): Promise<StardustApp> {
    const response = await axios.get(`${url}/application`, { headers: { 'x-api-key': apiKey } });
    const { name, email, description, id: appId } = response.data;
    return new StardustApp(apiKey, appId, url, name, email, description);
  }

  public getId(): string {
    return this._appId;
  }
}
