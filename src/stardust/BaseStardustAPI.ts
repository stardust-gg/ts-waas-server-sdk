import axios, { HttpStatusCode } from 'axios';

const URL = 'https://custodial-wallet.stardust.gg';

export default class BaseStardustAPI {
  constructor(protected apiKey: string, protected url: string = URL) {}

  public async apiGet(endpoint: string, query: any = {}) {
    const response = await axios.get(`${this.url}/${endpoint}`, {
      headers: { 'x-api-key': this.apiKey },
      params: query,
    });
    if (response.status !== HttpStatusCode.Ok)
      throw new Error(`Failed to GET from ${endpoint} with query: ${JSON.stringify(query)}`);
    return response.data;
  }

  public async apiPost(endpoint: string, data: any = {}) {
    const response = await axios.post(`${this.url}/${endpoint}`, data, {
      headers: { 'x-api-key': this.apiKey },
    });
    if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${JSON.stringify(data)}`);
    return response.data;
  }
}
