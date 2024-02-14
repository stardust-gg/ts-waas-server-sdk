export type StardustProfileData = {
  id: string;
  rootUserId: string;
  applicationId: string;
  wallets?: any[] | null;
  identifiers?: any[] | null;
  name: string | null;
  createdAt: number;
} & { apiKey?: string };

export type StardustProfileCreateParams = {
  applicationId: string;
  name?: string;
};

export type ProfileIdentifierData = {
  id: string;
  rootUserId: string;
  profileId: string;
  service: string;
  value: string;
  createdAt: number;
} & { apiKey?: string };

export type StardustProfileIdentifierCreateParams = {
  profileId: string;
  service: string;
  value: string;
};

export type StardustProfileIdentifierListParams = {
  profileId: string;
  start: number;
  limit: number;
};
