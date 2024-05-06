export type StardustWalletData = {
  id: string;
  profileId: string;
  applicationId: string;
  createdAt: number;
  lastUsedAt: number | null;
} & { apiKey?: string };
