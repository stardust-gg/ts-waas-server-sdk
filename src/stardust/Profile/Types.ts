import { StardustWalletData } from '../Wallet/Types';

export type StardustProfileData = {
  id: string;
  rootUserId: string;
  applicationId: string;
  wallets?: StardustWalletData[] | null;
  identifiers?: StardustProfileIdentifierData[] | null;
  name: string | null;
  createdAt: number;
} & { apiKey?: string };

export type StardustProfileCreateParams = {
  applicationId: string;
  name?: string;
};

export type StardustProfileIdentifierData = {
  id: string;
  rootUserId: string;
  profileId: string;
  service: string;
  value: string;
  createdAt: number;
};

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

export enum StardustProfileIdentifierService {
  ExternalWallet = 'ts-sdk:external-wallet',
  Discord = 'ts-sdk:discord',
  Apple = 'ts-sdk:apple',
  Google = 'ts-sdk:google',
  Facebook = 'ts-sdk:facebook',
  Twitter = 'ts-sdk:twitter',
  Email = 'ts-sdk:email',
  Phone = 'ts-sdk:phone',
  Custom = 'ts-sdk:custom',
}
