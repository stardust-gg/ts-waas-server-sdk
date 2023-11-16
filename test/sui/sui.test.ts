import StardustSignerAPI from '../../src/stardust/StardustSignerAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../src/types';
import { describe, expect, it } from '@jest/globals';

import SuiSignTransactionBlockExample from '../../examples/sui/sui-sign-transaction-block';
import SuiSignPersonalMessageExample from '../../examples/sui/sui-sign-personal-message';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('ethers', () => {
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

  describe('sui', () => {
    it('should sign a transaction block', async () => {
      const { address, recoveredAddress } = await SuiSignTransactionBlockExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID,
        DEV_SYSTEM_STARDUST_WALLET_ID_2
      );
      expect(address).toBe(recoveredAddress);
    });

    it('should sign a personal message', async () => {
      const { address, recoveredAddress } = await SuiSignPersonalMessageExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID
      );
      expect(address).toBe(recoveredAddress);
    });
  });
});
