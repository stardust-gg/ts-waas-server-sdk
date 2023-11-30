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

  public async getApp(): Promise<StardustApp> {
    return this.stardustAppAPI.get();
  }

  public async createWallet(): Promise<StardustWallet> {
    return this.stardustWalletAPI.create();
  }

  public async getWallet(walletId: string): Promise<StardustWallet> {
    return this.stardustWalletAPI.get(walletId);
  }
}
