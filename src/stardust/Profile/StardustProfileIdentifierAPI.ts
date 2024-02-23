import BaseStardustAPI from '../BaseStardustAPI';
import StardustProfileIdentifier from './StardustProfileIdentifier';
import {
  StardustProfileIdentifierData,
  StardustProfileIdentifierCreateParams,
  StardustProfileIdentifierListParams,
} from './Types';

export default class StardustProfileIdentifierAPI extends BaseStardustAPI {
  public async create(params: StardustProfileIdentifierCreateParams): Promise<any> {
    const profileIdentifier = await this.apiPost('profile/identifier', params);
    return StardustProfileIdentifier.generate({ ...profileIdentifier, apiKey: this.apiKey });
  }

  public async get(profileIdentifierId: string): Promise<StardustProfileIdentifier> {
    const profileIdentifier = await this.apiGet(`profile/identifier/${profileIdentifierId}`);
    return StardustProfileIdentifier.generate({ ...profileIdentifier, apiKey: this.apiKey });
  }

  public async list(
    params: StardustProfileIdentifierListParams
  ): Promise<StardustProfileIdentifier[]> {
    const profileIdentifiers = await this.apiGet('profile/identifier', params);
    return profileIdentifiers.results.map((profileIdentifier: StardustProfileIdentifierData) =>
      StardustProfileIdentifier.generate({ ...profileIdentifier })
    );
  }
}
