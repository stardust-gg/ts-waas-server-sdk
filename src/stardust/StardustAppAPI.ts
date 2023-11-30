import AbstractStardustAPI from './AbstractStardustAPI';
import StardustApp from './StardustApp';

export default class StardustAppAPI extends AbstractStardustAPI {
  public async get(): Promise<StardustApp> {
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
