import BaseStardustAPI from '../Api/BaseStardustAPI';
import StardustApplication from './StardustApplication';

export default class StardustApplicationAPI extends BaseStardustAPI {
  public async get(): Promise<StardustApplication> {
    const applicationData = await this.api.get('application');
    return StardustApplication.generate({ ...applicationData, apiKey: this.api.apiKey });
  }
}
