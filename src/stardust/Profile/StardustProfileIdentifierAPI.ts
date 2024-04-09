import BaseStardustAPI from '../Api/BaseStardustAPI';
import StardustProfileIdentifier from './StardustProfileIdentifier';
import {
  StardustProfileIdentifierData,
  StardustProfileIdentifierListParams,
  StardustCustomProfileIdentifierCreateParams,
  StardustExternalWalletProfileIdentifierCreateParams,
  StardustExternalWalletChainType,
} from './Types';

export default class StardustProfileIdentifierAPI extends BaseStardustAPI {
  public async createCustomIdentifier(
    params: StardustCustomProfileIdentifierCreateParams
  ): Promise<StardustProfileIdentifier> {
    const profileIdentifier = await this.api.post('profile/identifier', params);
    console.log('profileIdentifier', profileIdentifier);
    return StardustProfileIdentifier.generate({
      ...profileIdentifier,
      apiKey: this.api.apiKey,
    });
  }

  public async createExternalWalletIdentifier(
    chainType: StardustExternalWalletChainType,
    params: StardustExternalWalletProfileIdentifierCreateParams
  ): Promise<StardustProfileIdentifier> {
    const profileIdentifier = await this.api.post(
      `profile/identifier/external-wallet/${chainType}`,
      params
    );
    return StardustProfileIdentifier.generate({
      ...profileIdentifier,
      apiKey: this.api.apiKey,
    });
  }

  public async get(profileIdentifierId: string): Promise<StardustProfileIdentifier> {
    const profileIdentifier = await this.api.get(`profile/identifier/${profileIdentifierId}`);
    return StardustProfileIdentifier.generate({
      ...profileIdentifier,
      apiKey: this.api.apiKey,
    });
  }

  public async list(
    params: StardustProfileIdentifierListParams
  ): Promise<StardustProfileIdentifier[]> {
    const profileIdentifiers = await this.api.get('profile/identifier', params);
    return profileIdentifiers.results.map((profileIdentifier: StardustProfileIdentifierData) =>
      StardustProfileIdentifier.generate({ ...profileIdentifier, apiKey: this.api.apiKey })
    );
  }
}
