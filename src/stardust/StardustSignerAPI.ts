import { ApiRequestPayload, SignRequestPayload } from '../types';
import AbstractStardustAPI from './AbstractStardustAPI';

export default class StardustSignerAPI extends AbstractStardustAPI {
  constructor(apiKey: string) {
    super(apiKey);
  }

  async getAddress(requestParams: ApiRequestPayload): Promise<string> {
    const response = await this.apiGet('wallet/address', requestParams);
    return response.address;
  }

  async signMessage(requestParams: SignRequestPayload): Promise<string> {
    const response = await this.apiPost('sign', requestParams);
    return response.signedMessage;
  }
}
