import axios, { HttpStatusCode } from 'axios';

const URL = 'https://custodial-wallet.stardust.gg';
// const URL = 'http://localhost:3000';
export default class AbstractStardustAPI {
  // eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
  constructor(protected apiKey: string) {}

  static async Post(endpoint: string, data: any, apiKey: string = '') {
    const response = await axios.post(`${URL}/${endpoint}`, data, {
      headers: { 'x-api-key': apiKey },
    });
    if (response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${data}`);
    return response.data;
  }

  async apiGet(endpoint: string, query: any = {}) {
    const response = await axios.get(`${URL}/${endpoint}`, {
      headers: { 'x-api-key': this.apiKey },
      params: query,
    });
    if (response.status !== HttpStatusCode.Ok)
      throw new Error(`Failed to GET from ${endpoint} with query: ${query}`);
    return response.data;
  }

  async apiPost(endpoint: string, data: any = {}) {
    const response = await axios.post(`${URL}/${endpoint}`, data, {
      headers: { 'x-api-key': this.apiKey },
    });
    if (response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${data}`);
    return response.data;
  }
}
