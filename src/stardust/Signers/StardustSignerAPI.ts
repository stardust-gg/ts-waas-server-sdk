import { ApiRequestPayload, SignRequestPayload } from '../../types';
import BaseStardustAPI from '../BaseStardustAPI';

export default class StardustSignerAPI extends BaseStardustAPI {
  public async getAddress(requestParams: ApiRequestPayload): Promise<string> {
    const response = await this.apiGet('wallet/address', requestParams);
    return response.address;
  }

  public async getPublicKey(requestParams: ApiRequestPayload): Promise<string> {
    const response = await this.apiGet('wallet/public-key', requestParams);
    return response.publicKey;
  }

  public async signMessage(requestParams: SignRequestPayload): Promise<string> {
    const { signature } = await this.apiPost('sign/message', requestParams);
    return signature;
  }

  public async signTransaction(requestParams: SignRequestPayload): Promise<string> {
    const { signature } = await this.apiPost('sign/transaction', requestParams);
    return signature;
  }
}
