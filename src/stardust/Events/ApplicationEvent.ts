import ClientAppEvent from './ClientAppEvent';

/* eslint-disable max-classes-per-file */
export default class ApplicationEvent {
  app_id: string;

  events: ClientAppEvent[];
}
