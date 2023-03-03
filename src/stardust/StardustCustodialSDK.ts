import StardustApp from './StardustApp';
import StardustAppAPI from './StardustAppAPI';
import StardustWallet from './StardustWallet';
import StardustWalletAPI from './StardustWalletAPI';

export default class StardustCustodialSdk {
  private stardustAppAPI: StardustAppAPI;
  private stardustWalletAPI: StardustWalletAPI;
  constructor(apiKey: string) {
    this.stardustAppAPI = new StardustAppAPI(apiKey);
    this.stardustWalletAPI = new StardustWalletAPI(apiKey);
  }

  static async createApp(stardustApp: StardustApp): Promise<StardustApp> {
    return await StardustAppAPI.create(stardustApp);
  }

  async getApp(): Promise<StardustApp> {
    return await this.stardustAppAPI.get();
  }

  async createWallet(): Promise<StardustWallet> {
    return await this.stardustWalletAPI.create();
  }

  async getWallet(walletId: string): Promise<StardustWallet> {
    return await this.stardustWalletAPI.get(walletId);
  }
}
