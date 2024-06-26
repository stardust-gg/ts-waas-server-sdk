import BaseStardustAPIFactory from './BaseStardustAPIFactory';
import BaseStardustAPIInterface from './BaseStardustAPIInterface';

const URL = 'https://custodial-wallet.stardust.gg';

export default class BaseStardustAPI {
  public readonly api: BaseStardustAPIInterface;

  constructor(apiKey: string, url: string = URL) {
    this.api = BaseStardustAPIFactory(apiKey, url);
  }
}
