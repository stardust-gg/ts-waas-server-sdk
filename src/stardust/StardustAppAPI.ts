import AbstractStardustAPI from './AbstractStardustAPI';
import StardustApp from './StardustApp';

export default class StardustAppAPI extends AbstractStardustAPI {
  constructor(apiKey: string, url?: string) {
    super(apiKey, url);
  }

  async get(): Promise<StardustApp> {
    const appData = await this.apiGet('application');
    return new StardustApp(
      appData.name,
      appData.email,
      appData.description,
      appData.id,
      this.apiKey
    );
  }
}
