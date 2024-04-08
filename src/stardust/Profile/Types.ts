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
  type: StardustProfileIdentifierType;
} & { apiKey?: string };

export enum StardustProfileIdentifierType {
  Custom = 'custom',
  ExternalWallet = 'external-wallet',
}

export enum StardustExternalWalletChainType {
  EVM = 'evm',
  SOL = 'sol',
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
