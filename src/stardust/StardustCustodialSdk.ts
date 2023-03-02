import StardustApp from './StardustApp';

const URL = 'http://34.205.37.173:443';

export default class StardustCustodialSdk {
  readonly name: string;
  constructor() {
    this.name = 'StardustCustodialSdk';
  }

  static async createApp(
    name: string,
    email: string,
    description: string | null
  ): Promise<{ stardustApp: StardustApp; apiKey: string }> {
    return StardustApp.create(URL, name, email, description);
  }

  static async getApp(apiKey: string): Promise<StardustApp> {
    return StardustApp.get(URL, apiKey);
  }
}
