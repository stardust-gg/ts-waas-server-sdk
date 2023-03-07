import { Signature } from '@ethersproject/bytes';
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

  async signMessage(requestParams: SignRequestPayload): Promise<Signature> {
    const { signature } = await this.apiPost('sign/message', requestParams);
    return signature;
  }

  // returns signature
  async signTransaction(requestParams: SignRequestPayload): Promise<Signature> {
    const resp = await this.apiPost('sign/transaction', requestParams);
    return resp.signature;
  }
}
