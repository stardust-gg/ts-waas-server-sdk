import axios, { HttpStatusCode } from 'axios';
const URL = 'https://custodial-wallet.stardust.gg';
export default class AbstractStardustAPI {
  constructor(protected apiKey: string) {}

  static async post(endpoint: string, data: any) {
    // console.log('POST:', `${URL}/${endpoint}`);
    const response = await axios.post(`${URL}/${endpoint}`, data);
    if (response.status !== HttpStatusCode.Created) throw new Error('Failed to create app');
    return response.data;
  }

  async apiGet(endpoint: string, data: any = {}) {
    // console.log('GET:', `${URL}/${endpoint}`);
    const response = await axios.get(`${URL}/${endpoint}`, {
      ...data,
      headers: { 'x-api-key': this.apiKey },
    });
    if (response.status !== HttpStatusCode.Ok) throw new Error('Failed to get app');
    return response.data;
  }
}
