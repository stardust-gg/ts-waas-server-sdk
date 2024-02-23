import BaseStardustAPI from '../BaseStardustAPI';
import StardustWallet from './StardustWallet';

export default class StardustWalletAPI extends BaseStardustAPI {
  public async create(profileId?: string): Promise<StardustWallet> {
    const walletData = await this.apiPost('wallet', { profileId });
    return StardustWallet.generate({ ...walletData, apiKey: this.apiKey });
  }

  public async get(walletId: string): Promise<StardustWallet> {
    const walletData = await this.apiGet(`wallet/${walletId}`);
    return StardustWallet.generate({ ...walletData, apiKey: this.apiKey });
  }
}
