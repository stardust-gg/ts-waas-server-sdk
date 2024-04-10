// eslint-disable-next-line import/no-cycle
import StardustWallet from '../Wallet/StardustWallet';
// eslint-disable-next-line import/no-cycle
import StardustProfileIdentifier from './StardustProfileIdentifier';
import StardustProfileIdentifierAPI from './StardustProfileIdentifierAPI';
import { StardustExternalWalletChainType, StardustProfileData } from './Types';
import { StardustWalletData } from '../Wallet/Types';

export default class StardustProfile {
  public readonly wallet: StardustWallet;

  stardustProfileIdentifierAPI: StardustProfileIdentifierAPI;

  constructor(
    public readonly id: string,
    public readonly rootUserId: string,
    public readonly applicationId: string,
    public readonly createdAt: Date,
    public readonly wallets: StardustWallet[] | null = [],
    public readonly identifiers: StardustProfileIdentifier[] | null = [],
    public readonly name: string | null = null,
    apiKey: string | null = null
  ) {
    [this.wallet] = wallets?.filter((wallet) => wallet.profileId === id) || [];
    this.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(apiKey!);
  }

  public async addCustomIdentifier(
    service: string,
    value: string
  ): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.createCustomIdentifier({
      profileId: this.id,
      service,
      value,
    }) as Promise<StardustProfileIdentifier>;
  }

  public async addExternalWalletIdentifier(
    chainType: StardustExternalWalletChainType,
    value: string
  ): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.createExternalWalletIdentifier(chainType, {
      profileId: this.id,
      value,
    }) as Promise<StardustProfileIdentifier>;
  }

  /**
   *
   * @param start - the start index of the identifiers to return
   * @param limit - the number of identifiers to return
   *
   * by default start is 0 and limit is 10, giving the first 10 identifiers for the profile
   *
   */
  public async getIdentifiers(
    start: number = 0,
    limit: number = 10
  ): Promise<StardustProfileIdentifier[]> {
    const params = { profileId: this.id, start, limit };

    return this.stardustProfileIdentifierAPI.list(params);
  }

  public static generate(profileData: StardustProfileData): StardustProfile {
    return new StardustProfile(
      profileData.id,
      profileData.rootUserId,
      profileData.applicationId,
      new Date(profileData.createdAt * 1000),
      profileData.wallets?.map((walletData: StardustWalletData) =>
        StardustWallet.generate({ ...walletData, apiKey: profileData.apiKey })
      ),
      profileData.identifiers?.map((profileIdentifierData) =>
        StardustProfileIdentifier.generate({ ...profileIdentifierData })
      ),
      profileData.name,
      profileData.apiKey
    );
  }

  public valueOf(): Object {
    const { stardustProfileIdentifierAPI, ...rest } = this;
    return rest;
  }
}
