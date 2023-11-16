import StardustSignerAPI from '../../src/stardust/StardustSignerAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../src/types';
import { describe, expect, it } from '@jest/globals';

import ImxRegisterUserExample from '../../examples/imx/imx-register-user';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('imx', () => {
  let DEV_SYSTEM_STARDUST_API_URL: string;
  let DEV_SYSTEM_STARDUST_API_KEY: string;
  let DEV_SYSTEM_STARDUST_WALLET_ID: string;
  let DEV_SYSTEM_STARDUST_WALLET_ID_2: string;

  let signerAPI: StardustSignerAPI;

  beforeAll(async () => {
    DEV_SYSTEM_STARDUST_API_URL = String(process.env.DEV_SYSTEM_STARDUST_API_URL);
    DEV_SYSTEM_STARDUST_API_KEY = String(process.env.DEV_SYSTEM_STARDUST_API_KEY);
    DEV_SYSTEM_STARDUST_WALLET_ID = String(process.env.DEV_SYSTEM_STARDUST_WALLET_ID);
    DEV_SYSTEM_STARDUST_WALLET_ID_2 = String(process.env.DEV_SYSTEM_STARDUST_WALLET_ID_2);

    signerAPI = new StardustSignerAPI(DEV_SYSTEM_STARDUST_API_KEY, DEV_SYSTEM_STARDUST_API_URL);
  });

  describe('imx', () => {
    it('should register a user', async () => {
      const { accounts } = await ImxRegisterUserExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID
      );
      expect(accounts.length).toBeGreaterThan(0);
    });
  });
});
