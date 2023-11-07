import type { Signature } from '@ethersproject/bytes';
import { ApiRequestPayload, SignRequestPayload } from '../types';
import AbstractStardustAPI from './AbstractStardustAPI';

export default class StardustSignerAPI extends AbstractStardustAPI {
  // eslint-disable-next-line no-useless-constructor
  constructor(apiKey: string, url?: string) {
    super(apiKey, url);
  }

  async getAddress(requestParams: ApiRequestPayload): Promise<string> {
    const response = await this.apiGet('wallet/address', requestParams);
    return response.address;
  }

  async getPublicKey(requestParams: ApiRequestPayload): Promise<string> {
    const response = await this.apiGet('wallet/public-key', requestParams);
    return response.publicKey;
  }

  async signMessage(requestParams: SignRequestPayload): Promise<Signature> {
    const { signature } = await this.apiPost('sign/message', requestParams);
    return signature;
  }

  async signTransaction(requestParams: SignRequestPayload): Promise<Signature> {
    const { signature } = await this.apiPost('sign/transaction', requestParams);
    return signature;
  }
}
