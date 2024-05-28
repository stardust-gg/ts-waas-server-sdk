import ApplicationEvent from '../Events/ApplicationEvent';
import BaseStardustAPIFactory from './BaseStardustAPIFactory';
import BaseStardustAPIInterface from './BaseStardustAPIInterface';

const URL = 'https://track.stardust.gg/v1';

export default class StardustEventsAPI {
  public readonly api: BaseStardustAPIInterface;

  constructor(url: string = URL) {
    this.api = BaseStardustAPIFactory('no-key-required', url);
  }

  public async postAppEvent(event: ApplicationEvent): Promise<void> {
    await this.api.unauthenticatedPost('app-events/ingest', event);
  }
}
