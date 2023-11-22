import StardustSignerAPI from '../../src/stardust/StardustSignerAPI';
import { describe, expect, it } from '@jest/globals';

import V5SignMessageExample from '../../examples/ethers/v5/sign-message';
import V5SignTypedDataExample from '../../examples/ethers/v5/sign-typed-data';
import V5SignTransaction from '../../examples/ethers/v5/sign-transaction';

import V6SignMessageExample from '../../examples/ethers/v6/sign-message';
import V6SignTypedDataExample from '../../examples/ethers/v6/sign-typed-data';

// allow usage of env
import dotenv from 'dotenv';
import * as ethers_v5 from 'ethers';
import * as ethers_v6 from 'ethers_v6';
import { ethers } from 'ethers';
import { StardustCustodialSDK } from '../../src';

dotenv.config();

describe('ethers', () => {
  let PROD_SYSTEM_STARDUST_API_URL: string;
  let PROD_SYSTEM_STARDUST_API_KEY: string;
  let PROD_SYSTEM_STARDUST_WALLET_ID: string;

  let signerAPI: StardustSignerAPI;

  beforeAll(async () => {
    PROD_SYSTEM_STARDUST_API_URL = String(process.env.PROD_SYSTEM_STARDUST_API_URL);
    PROD_SYSTEM_STARDUST_API_KEY = String(process.env.PROD_SYSTEM_STARDUST_API_KEY);
    PROD_SYSTEM_STARDUST_WALLET_ID = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID);

    signerAPI = new StardustSignerAPI(PROD_SYSTEM_STARDUST_API_KEY, PROD_SYSTEM_STARDUST_API_URL);
  });

  describe('v5', () => {
    describe('error cases', () => {
      it('should throw if the tx object has an invalid from address', async () => {
        const provider = new ethers_v5.providers.JsonRpcProvider('https://eth.public-rpc.com');

        const tx = {
          to: '',
          from: '0x123',
          value: ethers.utils.parseEther('0.1'),
        };

        const signer = new StardustCustodialSDK(PROD_SYSTEM_STARDUST_API_KEY).getWallet(
          PROD_SYSTEM_STARDUST_WALLET_ID
        );
      });
    });
    describe('use cases', () => {
      it('should sign a message', async () => {
        const provider = new ethers_v5.providers.JsonRpcProvider('https://eth.public-rpc.com');
        const { ethAddress, recoveredAddress } = await V5SignMessageExample(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_WALLET_ID,
          provider
        );
        expect(ethAddress).toBe(recoveredAddress);
      });

      it('should sign typed data', async () => {
        const provider = new ethers_v5.providers.JsonRpcProvider('https://eth.public-rpc.com');
        const { ethAddress, recoveredAddress } = await V5SignTypedDataExample(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_WALLET_ID,
          provider
        );
        expect(ethAddress).toBe(recoveredAddress);
      });

      it('should sign a tx object', async () => {
        const provider = new ethers_v5.providers.JsonRpcProvider('https://eth.public-rpc.com');
        const { ethAddress, recoveredAddress } = await V5SignTransaction(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_WALLET_ID,
          provider
        );
        expect(ethAddress).toBe(recoveredAddress);
      });
    });
  });

  describe('v6', () => {
    it('should sign a message', async () => {
      const provider = new ethers_v6.JsonRpcProvider('https://eth.public-rpc.com');
      const { ethAddress, recoveredAddress } = await V6SignMessageExample(
        PROD_SYSTEM_STARDUST_API_KEY,
        PROD_SYSTEM_STARDUST_WALLET_ID,
        provider
      );
      expect(ethAddress).toBe(recoveredAddress);
    });

    it('should sign typed data', async () => {
      const provider = new ethers_v6.JsonRpcProvider('https://eth.public-rpc.com');
      const { ethAddress, recoveredAddress } = await V6SignTypedDataExample(
        PROD_SYSTEM_STARDUST_API_KEY,
        PROD_SYSTEM_STARDUST_WALLET_ID,
        provider
      );
      expect(ethAddress).toBe(recoveredAddress);
    });
  });
});
