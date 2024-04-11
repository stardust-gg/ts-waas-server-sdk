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

export enum StardustProfileIdentifierService {
  Discord = 'ts-sdk:discord',
  Apple = 'ts-sdk:apple',
  Google = 'ts-sdk:google',
  Facebook = 'ts-sdk:facebook',
  Twitter = 'ts-sdk:twitter',
  Email = 'ts-sdk:email',
  Phone = 'ts-sdk:phone',
}

export type StardustProfileIdentifierData = {
  id: string;
  rootUserId: string;
  profileId: string;
  service: string;
  value: string;
  createdAt: number;
  type: StardustProfileIdentifierType;
} & { apiKey?: string };

export enum StardustProfileIdentifierType {
  Custom = 'custom',
  ExternalWallet = 'external-wallet',
}

export enum StardustExternalWalletChainType {
  EVM = 'evm',
  SOL = 'solana',
  SUI = 'sui',
}

export type StardustCustomProfileIdentifierCreateParams =
  StardustExternalWalletProfileIdentifierCreateParams & {
    service: string;
  };

export type StardustExternalWalletProfileIdentifierCreateParams = {
  profileId: string;
  value: string;
};

export type StardustProfileIdentifierListParams = {
  profileId: string;
  start: number;
  limit: number;
};
