export default interface BaseStardustAPIInterface {
  url: string;
  get(endpoint: string, query?: any): Promise<any>;
  post(endpoint: string, data?: any): Promise<any>;
  get apiKey(): string;
}
