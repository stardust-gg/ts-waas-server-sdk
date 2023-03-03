import AbstractStardustAPI from './AbstractStardustAPI';
import StardustApp from './StardustApp';

export default class StardustAppAPI extends AbstractStardustAPI {
  constructor(apiKey: string) {
    super(apiKey);
  }
  // creates a new app in the stardust database.
  // Also sets the id and apiKey of the supplied app and returns it
  static async create(stardustApp: StardustApp) {
    const appData = await super.post('application', {
      name: stardustApp.name,
      email: stardustApp.email,
      description: stardustApp.description,
    });
    stardustApp.id = appData.id;
    stardustApp.apiKey = appData.apiKeys[0];
    return stardustApp;
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
