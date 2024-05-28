/* eslint-disable @typescript-eslint/no-unused-vars */
import DeviceMetadata from '../../Events/DeviceMetadata';
import StardustEventsAPI from '../../Api/StardustEventsAPI';
import ApplicationEvent from '../../Events/ApplicationEvent';
import ClientAppEvent from '../../Events/ClientAppEvent';
import { STANDARD_APP_EVENT_PREFIX, StandardAppEvents } from '../../Events/AppEvents';

export default class StardustProfileEvent {
  public eventsApi: StardustEventsAPI;

  public applicationId: string;

  public profileId: string;

  constructor(applicationId: string, profileId: string) {
    this.eventsApi = new StardustEventsAPI();
    this.applicationId = applicationId;
    this.profileId = profileId;
  }

  private validateIP(ip: string) {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex =
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|[0-9a-fA-F]{1,4}:([0-9a-fA-F]{1,4}:){1,4}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  public async addIp(ip: string): Promise<void> {
    if (!this.validateIP(ip)) {
      throw new Error(`Invalid IP address ${ip}`);
    }
    const event = this.createBaseEvent(StandardAppEvents.identify);
    event.device_metadata = new DeviceMetadata();
    event.device_metadata.ip = ip;
    await this.pushEvent(event);
  }

  public async addPurchase(purchaseInfo: Record<string, string>): Promise<void> {
    const event = this.createBaseEvent(StandardAppEvents.purchase);
    event.properties = purchaseInfo;
    await this.pushEvent(event);
  }

  private async pushEvent(event: ClientAppEvent): Promise<void> {
    const applicationEvent = new ApplicationEvent();
    applicationEvent.app_id = this.applicationId;
    applicationEvent.events = [event];
    await this.eventsApi.postAppEvent(applicationEvent);
  }

  private createBaseEvent(name: StandardAppEvents, tags: string[] = []): ClientAppEvent {
    const event = new ClientAppEvent();
    event.name = `${STANDARD_APP_EVENT_PREFIX}${name}`;
    event.user_id = this.profileId;
    event.client_timestamp = Math.floor(Date.now() / 1000);
    event.env = 'live';
    event.tags = ['ts-server-sdk', ...tags];
    return event;
  }
}
