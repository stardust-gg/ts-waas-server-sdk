import axios, { HttpStatusCode } from 'axios';
import BaseStardustAPIInterface from './BaseStardustAPIInterface';

export default function BaseStardustAPIFactory(
  apiKey: string,
  url: string
): BaseStardustAPIInterface {
  return new (class implements BaseStardustAPIInterface {
    url = url;

    public async get(endpoint: string, query = {}) {
      const response = await axios.get(`${this.url}/${endpoint}`, {
        headers: { 'x-api-key': apiKey },
        params: query,
      });
      if (response.status !== HttpStatusCode.Ok)
        throw new Error(`Failed to GET from ${endpoint} with query: ${JSON.stringify(query)}`);
      return response.data;
    }

    public async post(endpoint: string, data = {}) {
      const response = await axios.post(`${this.url}/${endpoint}`, data, {
        headers: { 'x-api-key': apiKey },
      });
      if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.Created)
        throw new Error(`Failed to POST to ${endpoint} with data: ${JSON.stringify(data)}`);
      return response.data;
    }

    get apiKey() {
      return apiKey;
    }
  })();
}
