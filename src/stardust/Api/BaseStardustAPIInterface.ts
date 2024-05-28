export default interface BaseStardustAPIInterface {
  get(endpoint: string, query?: any): Promise<any>;
  post(endpoint: string, data?: any): Promise<any>;
  unauthenticatedPost(endpoint: string, data?: any): Promise<any>;
  get apiKey(): string;
  get url(): string;
}
