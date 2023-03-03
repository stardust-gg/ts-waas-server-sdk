import StardustApp from './StardustApp';
import StardustAppAPI from './StardustAppAPI';

export default class StardustCustodialSdk {
  private stardustAppAPI: StardustAppAPI;
  constructor(private apiKey: string) {
    this.stardustAppAPI = new StardustAppAPI(apiKey);
  }

  static async createApp(stardustApp: StardustApp): Promise<StardustApp> {
    return await StardustAppAPI.create(stardustApp);
  }

  async getApp(): Promise<StardustApp> {
    return await this.stardustAppAPI.get();
  }
}
