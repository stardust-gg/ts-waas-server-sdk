// eslint-disable-next-line import/no-cycle
import StardustWallet from '../Wallet/StardustWallet';
// eslint-disable-next-line import/no-cycle
import StardustProfileAPI from './StardustProfileAPI';
import StardustProfileIdentifier from './StardustProfileIdentifier';
import StardustProfileIdentifierAPI from './StardustProfileIdentifierAPI';
import { StardustProfileData, StardustProfileIdentifierService } from './Types';

export default class StardustProfile {
  public readonly wallet: StardustWallet;

  public stardustProfileIdentifierAPI: StardustProfileIdentifierAPI;

  public stardustProfileAPI: StardustProfileAPI;

  constructor(
    public readonly id: string,
    public readonly rootUserId: string,
    public readonly applicationId: string,
    public readonly createdAt: Date,
    public readonly wallets: StardustWallet[] | null = [],
    public readonly identifiers: StardustProfileIdentifier[] | null = [],
    public readonly name: string | null = null,
    public readonly apiKey: string | null = null
  ) {
    [this.wallet] = wallets?.filter((wallet) => wallet.profileId === id) || [];
    this.stardustProfileAPI = new StardustProfileAPI(this.apiKey!);
    this.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(this.apiKey!);
  }

  /**
   *
   * For now this function call is the 'unverified' version of validation,
   *
   * @param service
   * @param value
   * @returns
   */
  public async addIdentifier(
    service: StardustProfileIdentifierService,
    value: string
  ): Promise<StardustProfileIdentifier> {
    if (!StardustProfileIdentifier.validateIdentifier(service, value)) {
      throw new Error(
        `Invalid service ${service}, please use StardustProfileIdentifierService enums`
      );
    }
    return this.stardustProfileIdentifierAPI.create({
      profileId: this.id,
      service,
      value,
    });
  }

  public async addCustomIdentifier(
    service: string,
    value: string
  ): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.create({
      profileId: this.id,
      service: `ts-sdk:custom:${service}`,
      value,
    });
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
      profileData.wallets?.map((walletData) =>
        StardustWallet.generate({ ...walletData, apiKey: profileData.apiKey })
      ),
      profileData.identifiers?.map((profileIdentifierData) =>
        StardustProfileIdentifier.generate({ ...profileIdentifierData })
      ),
      profileData.name,
      profileData.apiKey
    );
  }
}
