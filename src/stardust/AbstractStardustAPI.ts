import axios, { HttpStatusCode } from 'axios';
// const URL = 'https://custodial-wallet.stardust.gg';
const URL = 'http://localhost:3000';
export default class AbstractStardustAPI {
  constructor(protected apiKey: string) {}

  static async post(endpoint: string, data: any) {
    // console.log('POST:', `${URL}/${endpoint}`);
    const response = await axios.post(`${URL}/${endpoint}`, data);
    if (response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${data}`);
    return response.data;
  }

  static async get(endpoint: string, query: any = {}, apiKey: string = '') {
    const response = await await axios.get(`${URL}/${endpoint}`, {
      headers: { 'x-api-key': apiKey },
      params: query,
    });
    if (response.status !== HttpStatusCode.Ok) throw new Error(`Failed to GET from ${endpoint}`);
    return response.data;
  }

  async apiGet(endpoint: string) {
    // console.log('GET:', `${URL}/${endpoint}`);
    const response = await axios.get(`${URL}/${endpoint}`, {
      headers: { 'x-api-key': this.apiKey },
    });
    if (response.status !== HttpStatusCode.Ok) throw new Error(`Failed to GET from ${endpoint}`);
    return response.data;
  }

  async apiPost(endpoint: string, data: any = {}) {
    // console.log('apiPost:', `${URL}/${endpoint}\n`, 'data:', data);
    const response = await axios.post(`${URL}/${endpoint}`, data, {
      headers: { 'x-api-key': this.apiKey },
    });
    if (response.status !== HttpStatusCode.Created)
      throw new Error(`Failed to POST to ${endpoint} with data: ${data}`);
    return response.data;
  }
}
