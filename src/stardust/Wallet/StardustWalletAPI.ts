import BaseStardustAPI from '../Api/BaseStardustAPI';
import StardustWallet from './StardustWallet';

export default class StardustWalletAPI extends BaseStardustAPI {
  public async create(applicationId?: string): Promise<StardustWallet> {
    const walletData = await this.api.post('wallet', { applicationId });
    return StardustWallet.generate({ ...walletData, apiKey: this.api.apiKey });
  }

  public async get(walletId: string): Promise<StardustWallet> {
    const walletData = await this.api.get(`wallet/${walletId}`);
    return StardustWallet.generate({ ...walletData, apiKey: this.api.apiKey });
  }
}
