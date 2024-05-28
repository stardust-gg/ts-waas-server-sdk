import DeviceMetadata from './DeviceMetadata';
import ExternalIds from './ExternalIds';

export default class ClientAppEvent {
  name: string;

  user_id?: string;

  session_id?: string;

  device_metadata?: DeviceMetadata;

  external_ids?: ExternalIds;

  value?: {
    amount?: number;

    unit?: string;
  };

  client_timestamp: number;

  env: string;

  tags: string[];

  properties?: Record<string, string>;
}
