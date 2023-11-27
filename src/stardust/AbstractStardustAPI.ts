import axios, { HttpStatusCode } from 'axios';
const URL = 'https://vault-api.stardust.gg';
export default class AbstractStardustAPI {
  constructor(protected apiKey: string, protected url: string = URL) {}

  static async Post(endpoint: string, data: any, apiKey: string = '') {
    const response = await axios.post(`${URL}/${endpoint}`, data, {
      headers: { 'x-api-key': apiKey },
    });
    if (response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${JSON.stringify(data)}`);
    return response.data;
  }

  async apiGet(endpoint: string, query: any = {}) {
    const response = await axios.get(`${this.url}/${endpoint}`, {
      headers: { 'x-api-key': this.apiKey },
      params: query,
    });
    if (response.status !== HttpStatusCode.Ok)
      throw new Error(`Failed to GET from ${endpoint} with query: ${JSON.stringify(query)}`);
    return response.data;
  }

  async apiPost(endpoint: string, data: any = {}) {
    const response = await axios.post(`${this.url}/${endpoint}`, data, {
      headers: { 'x-api-key': this.apiKey },
    });
    if (response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${JSON.stringify(data)}`);
    return response.data;
  }
}
