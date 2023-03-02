import StardustApp from './StardustApp';

const URL = 'http://34.205.37.173:443';

export default class StardustCustodialSdk {
  readonly name: string = 'StardustCustodialSdk';
  constructor() {}

  static async createApp(
    name: string,
    email: string,
    description: string | null
  ): Promise<StardustApp> {
    return StardustApp.create(URL, name, email, description);
  }

  static async getApp(apiKey: string): Promise<StardustApp> {
    return StardustApp.get(URL, apiKey);
  }
}
