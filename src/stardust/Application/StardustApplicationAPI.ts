import BaseStardustAPI from '../Api/BaseStardustAPI';
import StardustApplication from './StardustApplication';
import { StardustApplicationData } from './Types';

export default class StardustApplicationAPI extends BaseStardustAPI {
  public async get(): Promise<StardustApplication> {
    const applicationData: StardustApplicationData = (await this.api.get('application')).results[0]; // api keys are 1:1 with applications
    return StardustApplication.generate({ ...applicationData, apiKey: this.api.apiKey });
  }
}
