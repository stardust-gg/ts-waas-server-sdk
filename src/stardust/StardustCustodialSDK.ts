import StardustApplication from './Application/StardustApplication';
import StardustApplicationAPI from './Application/StardustApplicationAPI';
import StardustProfile from './Profile/StardustProfile';
import StardustProfileAPI from './Profile/StardustProfileAPI';
import StardustProfileIdentifier from './Profile/StardustProfileIdentifier';
import StardustProfileIdentifierAPI from './Profile/StardustProfileIdentifierAPI';
import StardustWallet from './Wallet/StardustWallet';
import StardustWalletAPI from './Wallet/StardustWalletAPI';

export default class StardustCustodialSdk {
  private stardustApplicationAPI: StardustApplicationAPI;

  private stardustWalletAPI: StardustWalletAPI;

  private stardustProfileAPI: StardustProfileAPI;

  private stardustProfileIdentifierAPI: StardustProfileIdentifierAPI;

  constructor(apiKey: string, url?: string) {
    this.stardustApplicationAPI = new StardustApplicationAPI(apiKey, url);
    this.stardustWalletAPI = new StardustWalletAPI(apiKey, url);
    this.stardustProfileAPI = new StardustProfileAPI(apiKey, url);
    this.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(apiKey, url);
  }

  public async getApplication(): Promise<StardustApplication> {
    return this.stardustApplicationAPI.get();
  }

  /**
   * @deprecated Please create a profile and use the wallet generated for the profile via profile.wallet or profile.wallets
   */
  public async createWallet(): Promise<StardustWallet> {
    return this.stardustWalletAPI.create();
  }

  /**
   * @deprecated Please use getProfile in order to access your wallet(s) for the user
   */
  public async getWallet(walletId: string): Promise<StardustWallet> {
    return this.stardustWalletAPI.get(walletId);
  }

  public async createProfile(applicationId: string, name?: string): Promise<StardustProfile> {
    return this.stardustProfileAPI.create({ applicationId, name });
  }

  public async getProfile(profileId: string): Promise<StardustProfile> {
    return this.stardustProfileAPI.get(profileId);
  }

  public async getProfileIdentifier(
    profileIdentifierId: string
  ): Promise<StardustProfileIdentifier> {
    return this.stardustProfileIdentifierAPI.get(profileIdentifierId);
  }

  public async generateProfileJWT(profileId: string, duration: number): Promise<string> {
    return this.stardustProfileAPI.generateClientJWT(profileId, duration);
  }
}
