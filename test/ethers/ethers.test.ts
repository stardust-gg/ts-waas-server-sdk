import StardustSignerAPI from '../../src/stardust/StardustSignerAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../src/types';
import { describe, expect, it } from '@jest/globals';

import V5SignMessageExample from '../../examples/ethers/v5/sign-message';
import V5SignTypedDataExample from '../../examples/ethers/v5/sign-typed-data';

import V6SignMessageExample from '../../examples/ethers/v6/sign-message';
import V6SignTypedDataExample from '../../examples/ethers/v6/sign-typed-data';

// allow usage of env
import dotenv from 'dotenv';
import * as ethers_v5 from 'ethers';
import * as ethers_v6 from 'ethers_v6';

dotenv.config();

describe('ethers', () => {
  let DEV_SYSTEM_STARDUST_API_URL: string;
  let DEV_SYSTEM_STARDUST_API_KEY: string;
  let DEV_SYSTEM_STARDUST_WALLET_ID: string;

  let signerAPI: StardustSignerAPI;

  beforeAll(async () => {
    DEV_SYSTEM_STARDUST_API_URL = String(process.env.DEV_SYSTEM_STARDUST_API_URL);
    DEV_SYSTEM_STARDUST_API_KEY = String(process.env.DEV_SYSTEM_STARDUST_API_KEY);
    DEV_SYSTEM_STARDUST_WALLET_ID = String(process.env.DEV_SYSTEM_STARDUST_WALLET_ID);

    signerAPI = new StardustSignerAPI(DEV_SYSTEM_STARDUST_API_KEY, DEV_SYSTEM_STARDUST_API_URL);
  });

  describe('v5', () => {
    it('should sign a message', async () => {
      const provider = new ethers_v5.providers.JsonRpcProvider('https://eth.public-rpc.com');
      const { ethAddress, recoveredAddress } = await V5SignMessageExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID,
        provider
      );
      expect(ethAddress).toBe(recoveredAddress);
    });

    it('should sign typed data', async () => {
      const provider = new ethers_v5.providers.JsonRpcProvider('https://eth.public-rpc.com');
      const { ethAddress, recoveredAddress } = await V5SignTypedDataExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID,
        provider
      );
      expect(ethAddress).toBe(recoveredAddress);
    });
  });

  describe('v6', () => {
    it('should sign a message', async () => {
      const provider = new ethers_v6.JsonRpcProvider('https://eth.public-rpc.com');
      const { ethAddress, recoveredAddress } = await V6SignMessageExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID,
        provider
      );
      expect(ethAddress).toBe(recoveredAddress);
    });

    it('should sign typed data', async () => {
      const provider = new ethers_v6.JsonRpcProvider('https://eth.public-rpc.com');
      const { ethAddress, recoveredAddress } = await V6SignTypedDataExample(
        DEV_SYSTEM_STARDUST_API_KEY,
        DEV_SYSTEM_STARDUST_WALLET_ID,
        provider
      );
      expect(ethAddress).toBe(recoveredAddress);
    });
  });
});
