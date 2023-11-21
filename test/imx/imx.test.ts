import StardustSignerAPI from '../../src/stardust/StardustSignerAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../src/types';
import { describe, expect, it } from '@jest/globals';

import ImxRegisterUserExample from '../../examples/imx/imx-register-user';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('imx', () => {
  let PROD_SYSTEM_STARDUST_API_URL: string;
  let PROD_SYSTEM_STARDUST_API_KEY: string;
  let PROD_SYSTEM_STARDUST_WALLET_ID: string;
  let PROD_SYSTEM_STARDUST_WALLET_ID_2: string;

  let signerAPI: StardustSignerAPI;

  beforeAll(async () => {
    PROD_SYSTEM_STARDUST_API_URL = String(process.env.PROD_SYSTEM_STARDUST_API_URL);
    PROD_SYSTEM_STARDUST_API_KEY = String(process.env.PROD_SYSTEM_STARDUST_API_KEY);
    PROD_SYSTEM_STARDUST_WALLET_ID = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID);
    PROD_SYSTEM_STARDUST_WALLET_ID_2 = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID_2);

    signerAPI = new StardustSignerAPI(PROD_SYSTEM_STARDUST_API_KEY, PROD_SYSTEM_STARDUST_API_URL);
  });

  describe('imx', () => {
    it('should register a user', async () => {
      const { accounts } = await ImxRegisterUserExample(
        PROD_SYSTEM_STARDUST_API_KEY,
        PROD_SYSTEM_STARDUST_WALLET_ID
      );
      expect(accounts.length).toBeGreaterThan(0);
    });
  });
});
