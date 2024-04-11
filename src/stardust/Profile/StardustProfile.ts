// eslint-disable-next-line import/no-cycle
import StardustWallet from '../Wallet/StardustWallet';
// eslint-disable-next-line import/no-cycle
import StardustProfileIdentifier from './StardustProfileIdentifier';
import StardustProfileIdentifierAPI from './StardustProfileIdentifierAPI';
import {
  StardustExternalWalletChainType,
  StardustProfileData,
  StardustProfileIdentifierService,
} from './Types';
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

  public async addEVMExternalWalletIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.createExternalWalletIdentifier(
      StardustExternalWalletChainType.EVM,
      {
        profileId: this.id,
        value,
      }
    ) as Promise<StardustProfileIdentifier>;
  }

  public async addSUIExternalWalletIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.createExternalWalletIdentifier(
      StardustExternalWalletChainType.SUI,
      {
        profileId: this.id,
        value,
      }
    ) as Promise<StardustProfileIdentifier>;
  }

  public async addSOLExternalWalletIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.createExternalWalletIdentifier(
      StardustExternalWalletChainType.SOL,
      {
        profileId: this.id,
        value,
      }
    ) as Promise<StardustProfileIdentifier>;
  }

  public async addDiscordIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Discord, value);
  }

  public async addAppleIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Apple, value);
  }

  public async addGoogleIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Google, value);
  }

  public async addFacebookIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Facebook, value);
  }

  public async addTwitterIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Twitter, value);
  }

  public async addEmailIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Email, value);
  }

  public async addPhoneIdentifier(value: string): Promise<StardustProfileIdentifier> {
    return this.addCustomIdentifier(StardustProfileIdentifierService.Phone, value);
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
    limit: number = 20
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

  public toJson(): any {
    return {
      id: this.id,
      rootUserId: this.rootUserId,
      applicationId: this.applicationId,
      createdAt: this.createdAt,
      name: this.name,
      wallets: this.wallets?.map((wallet) => wallet.toJson()),
      identifiers: this.identifiers?.map((identifier) => identifier.toJson()),
      wallet: this.wallet.toJson(),
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}
