import BaseStardustAPI from '../Api/BaseStardustAPI';
import StardustApplication from './StardustApplication';
import { StardustApplicationData } from './Types';

export default class StardustApplicationAPI extends BaseStardustAPI {
  public async get(): Promise<StardustApplication> {
    const applicationData: StardustApplicationData = await this.api.get('application');
    return StardustApplication.generate({ ...applicationData, apiKey: this.api.apiKey });
  }
}
