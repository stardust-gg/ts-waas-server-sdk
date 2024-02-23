export type StardustApplicationData = {
  id: string;
  name: string;
  email: string;
  description: string | null;
  createdAt: number;
  lastUpdated: number | null;
  rootUserId: string;
  identityId: string;
} & { apiKey?: string };
