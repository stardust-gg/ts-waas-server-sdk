import { describe, expect, it } from '@jest/globals';

import SuiSignTransactionBlockExample from '../../examples/sui/sui-sign-transaction-block';
import SuiSignPersonalMessageExample from '../../examples/sui/sui-sign-personal-message';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('sui', () => {
  let PROD_SYSTEM_STARDUST_API_URL: string;
  let PROD_SYSTEM_STARDUST_API_KEY: string;
  let PROD_SYSTEM_STARDUST_WALLET_ID: string;
  let PROD_SYSTEM_STARDUST_WALLET_ID_2: string;

  beforeAll(async () => {
    PROD_SYSTEM_STARDUST_API_URL = String(process.env.PROD_SYSTEM_STARDUST_API_URL);
    PROD_SYSTEM_STARDUST_API_KEY = String(process.env.PROD_SYSTEM_STARDUST_API_KEY);
    PROD_SYSTEM_STARDUST_WALLET_ID = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID);
    PROD_SYSTEM_STARDUST_WALLET_ID_2 = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID_2);
  });

  it('should sign a transaction block', async () => {
    const { address, recoveredAddress } = await SuiSignTransactionBlockExample(
      PROD_SYSTEM_STARDUST_API_KEY,
      PROD_SYSTEM_STARDUST_WALLET_ID,
      PROD_SYSTEM_STARDUST_WALLET_ID_2
    );
    expect(address).toBe(recoveredAddress);
  });

  it('should sign a personal message', async () => {
    const { address, recoveredAddress } = await SuiSignPersonalMessageExample(
      PROD_SYSTEM_STARDUST_API_KEY,
      PROD_SYSTEM_STARDUST_WALLET_ID
    );
    expect(address).toBe(recoveredAddress);
  });
});
