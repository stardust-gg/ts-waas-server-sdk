import axios, { HttpStatusCode } from 'axios';
import { CreateApplicationPayload } from '../types';

export default class StardustApp {
  constructor(
    private readonly _apiKey: string,
    private _appId: string,
    private _name: string,
    private _email: string,
    private _description: string | null
  ) {}

  // creates a new app
  static async createApp(
    app: CreateApplicationPayload
  ): Promise<{ appId: string; stardustApp: StardustApp; apiKey: string }> {
    const response = await axios.post('http://127.0.0.1:3000/application', app);
    if (response.status != HttpStatusCode.Created) {
      throw 'Error creating app!';
    }
    const apiKey = response.data.apiKeys[0];
    const { id, name, email, description } = response.data;
    const stardustApp = new StardustApp(apiKey, id, name, email, description);

    return {
      appId: id,
      stardustApp,
      apiKey,
    };
  }

  getId(): string {
    return this._appId;
  }

  //   static async getApp(apiKey: string): Promise<StardustApp> {
  //     const response = await axios.get(`http://127.0.0.1:3000/application/${}`,{headers: {'x-api-key': this.}});
  //     if (response.status != HttpStatusCode.Created) {
  //       throw 'Error creating app!';
  //     }
  //   }
}
