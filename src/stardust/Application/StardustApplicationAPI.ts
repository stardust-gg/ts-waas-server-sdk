import BaseStardustAPI from '../BaseStardustAPI';
import StardustApplication from './StardustApplication';

export default class StardustApplicationAPI extends BaseStardustAPI {
  public async get(): Promise<StardustApplication> {
    const applicationData = await this.apiGet('application');
    return StardustApplication.generate({ ...applicationData, apiKey: this.apiKey });
  }
}
