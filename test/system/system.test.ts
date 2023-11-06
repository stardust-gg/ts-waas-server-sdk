import AbstractStardustAPI from '../../src/stardust/AbstractStardustAPI';
import StardustSignerAPI from '../../src/stardust/StardustSignerAPI';
import { SignRequestPayload } from '../../src/types';
import { describe, expect, it } from '@jest/globals';
// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('[Feature] Applications - /application', () => {
  let SYSTEM_VAULT_API_URL: string;
  let SYSTEM_VAULT_API_KEY: string;
  let SYSTEM_VAULT_WALLET_ID: string;

  let abstractAPI: AbstractStardustAPI;
  let signerAPI: StardustSignerAPI;

  beforeAll(async () => {
    // check to make sure all necessary envs are set
    SYSTEM_VAULT_API_URL = String(process.env.SYSTEM_VAULT_API_URL);
    SYSTEM_VAULT_API_KEY = String(process.env.SYSTEM_VAULT_API_KEY);
    SYSTEM_VAULT_WALLET_ID = String(process.env.SYSTEM_VAULT_WALLET_ID);

    abstractAPI = new AbstractStardustAPI(SYSTEM_VAULT_API_KEY, SYSTEM_VAULT_API_URL);
    signerAPI = new StardustSignerAPI(SYSTEM_VAULT_API_KEY, SYSTEM_VAULT_API_URL);
  });

  describe('Existing Application: functionality parity', () => {
    describe('evm', () => {
      it('should sign a message', async () => {
        const params: SignRequestPayload = {
          walletId: SYSTEM_VAULT_WALLET_ID,
          message: 'hello world',
          chainType: 'EVM',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBeDefined();
        console.log(signature);
      });
      it('should return an address', async () => {});
      it('should return a public key', async () => {});
    });

    describe('sol', () => {
      it('should sign a message', async () => {});
      it('should return an address', async () => {});
      it('should return a public key', async () => {});
    });

    describe('sui', () => {
      it('should sign a message', async () => {});
      it('should return an address', async () => {});
      it('should return a public key', async () => {});
    });
  });
});
