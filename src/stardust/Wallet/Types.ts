import { StardustApplicationData } from '../Application/Types';

export type StardustWalletData = {
  id: string;
  profileId: string;
  application: StardustApplicationData;
  createdAt: number;
  lastUsedAt: number | null;
} & { apiKey?: string };
