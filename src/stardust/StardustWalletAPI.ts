import AbstractStardustAPI from './AbstractStardustAPI';
import StardustWallet from './StardustWallet';

export default class StardustWalletAPI extends AbstractStardustAPI {
  public async create(): Promise<StardustWallet> {
    const walletData = await this.apiPost('wallet');
    return new StardustWallet(
      walletData.id,
      this.apiKey,
      new Date(walletData.createdAt),
      walletData.lastUsedAt ? new Date(walletData.lastUsedAt) : null
    );
  }

  public async get(walletId: string): Promise<StardustWallet> {
    const walletData = await this.apiGet(`wallet/${walletId}`);
    return new StardustWallet(
      walletId,
      this.apiKey,
      new Date(walletData.createdAt),
      walletData.lastUsedAt ? new Date(walletData.lastUsedAt) : null
    );
  }
}
