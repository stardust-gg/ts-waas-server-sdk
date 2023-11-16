import StardustSignerAPI from '../../../src/stardust/StardustSignerAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../../src/types';
import { describe, expect, it } from '@jest/globals';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('System: PROD Signing Parity', () => {
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

  describe('Existing Application: functionality parity', () => {
    describe('evm', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'EVM',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x96f2b95279b7bb7e0e7bc8b688afa3ae8a14d359067ff3ee4e24a69a6e7309e23941660f1efbce8eb2327446204577840f7644ad621a4c0793ff4ab82289895b1c'
        );
      });

      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'EVM',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x96f2b95279b7bb7e0e7bc8b688afa3ae8a14d359067ff3ee4e24a69a6e7309e23941660f1efbce8eb2327446204577840f7644ad621a4c0793ff4ab82289895b1c'
        );
      });

      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'EVM',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0x2210FA04B60d6846552F889DCde641022648F493');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'EVM',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe(
          '0x0430d2e6fca0581e74d7e156a6d9917e28b30bb053b19f78108c1ed361a1e433c31c34b82c5e3cadc2d4f1855f12f4687f318fa7338e1fc1509cebec8a48359a68'
        );
      });
    });

    describe('sol', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'sol',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x3536DEA1D085CC481F148BD616387AB8441F38FA1A7265241A38077290B61DE716AF08EBE7277FA06592CC3E3361D81AC24961B60C468FF0DC18742E94DBC90C'
        );
      });

      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'sol',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x3536DEA1D085CC481F148BD616387AB8441F38FA1A7265241A38077290B61DE716AF08EBE7277FA06592CC3E3361D81AC24961B60C468FF0DC18742E94DBC90C'
        );
      });

      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sol',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('8Jh1N5XzkGsvsnAeA6EPdF8Y8yxfQGi2ug4bppng2TDv');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sol',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe('8Jh1N5XzkGsvsnAeA6EPdF8Y8yxfQGi2ug4bppng2TDv');
      });
    });

    describe('sui', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'sui',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          'ADU23qHQhcxIHxSL1hY4erhEHzj6GnJlJBo4B3KQth3nFq8I6+cnf6Blksw+M2HYGsJJYbYMRo/w3Bh0LpTbyQxsierfKdh0UkIxFtapQZvTmbfjwzW++UogcFzyY3FMjQ=='
        );
      });

      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'sui',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          'ADU23qHQhcxIHxSL1hY4erhEHzj6GnJlJBo4B3KQth3nFq8I6+cnf6Blksw+M2HYGsJJYbYMRo/w3Bh0LpTbyQxsierfKdh0UkIxFtapQZvTmbfjwzW++UogcFzyY3FMjQ=='
        );
      });
      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sui',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0x34fbbe1c58782d1ef094841b63fff91e2062aaaa44225b88a7898664ced4d8f8');
      });
      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sui',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe('0x6c89eadf29d87452423116d6a9419bd399b7e3c335bef94a20705cf263714c8d');
      });
    });
  });
});
