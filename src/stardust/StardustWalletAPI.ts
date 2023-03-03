import AbstractStardustAPI from './AbstractStardustAPI';
import StardustWallet from './StardustWallet';

export default class StardustWalletAPI extends AbstractStardustAPI {
  constructor(apiKey: string) {
    super(apiKey);
  }

  async create(): Promise<StardustWallet> {
    const walletData = await this.apiPost('wallet');
    return new StardustWallet(walletData.id);
  }

  //   async get(walletId: string): Promise<StardustWallet> {
  //     const appData = await this.apiGet('wallet');
  //     return new StardustWallet(walletId);
  //   }
}
