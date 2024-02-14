import BaseStardustAPI from '../BaseStardustAPI';
import StardustProfile from './StardustProfile';
import { StardustProfileCreateParams } from './Types';

export default class StardustProfileAPI extends BaseStardustAPI {
  public async create(params: StardustProfileCreateParams): Promise<any> {
    const profileData = await this.apiPost('profile', params);
    return StardustProfile.generate({ ...profileData, apiKey: this.apiKey });
  }

  public async get(profileId: string): Promise<any> {
    const profileData = await this.apiGet(`profile/${profileId}`);
    return StardustProfile.generate({ ...profileData, apiKey: this.apiKey });
  }
}
