import BaseStardustAPI from '../Api/BaseStardustAPI';
// eslint-disable-next-line import/no-cycle
import StardustProfile from './StardustProfile';
import { StardustProfileCreateParams } from './Types';

export default class StardustProfileAPI extends BaseStardustAPI {
  public async create(params: StardustProfileCreateParams): Promise<StardustProfile> {
    const profileData = await this.api.post('profile', params);
    return StardustProfile.generate({ ...profileData, apiKey: this.api.apiKey });
  }

  public async get(profileId: string): Promise<StardustProfile> {
    const profileData = await this.api.get(`profile/${profileId}?expand=identifiers,wallets`);
    return StardustProfile.generate({ ...profileData, apiKey: this.api.apiKey });
  }

  public async generateClientJWT(profileId: string, duration: number): Promise<string> {
    const generateClientJWTData = await this.api.post(`profile/${profileId}/authenticate`, {
      duration,
    });
    return generateClientJWTData.jwt;
  }
}
