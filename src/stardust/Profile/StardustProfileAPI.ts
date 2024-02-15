import BaseStardustAPI from '../BaseStardustAPI';
// eslint-disable-next-line import/no-cycle
import StardustProfile from './StardustProfile';
import { StardustProfileCreateParams } from './Types';

export default class StardustProfileAPI extends BaseStardustAPI {
  public async create(params: StardustProfileCreateParams): Promise<StardustProfile> {
    const profileData = await this.apiPost('profile', params);
    return StardustProfile.generate({ ...profileData, apiKey: this.apiKey });
  }

  public async get(profileId: string): Promise<StardustProfile> {
    const profileData = await this.apiGet(`profile/${profileId}?expand=identifiers,wallets`);
    return StardustProfile.generate({ ...profileData, apiKey: this.apiKey });
  }
}
