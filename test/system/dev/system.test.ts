import StardustSignerAPI from '../../../src/stardust/StardustSignerAPI';
import { ApiRequestPayload, SignRequestPayload } from '../../../src/types';
import { describe, expect, it } from '@jest/globals';
// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('System: DEV Signing Parity', () => {
  let DEV_SYSTEM_VAULT_API_URL: string;
  let DEV_SYSTEM_VAULT_API_KEY: string;
  let DEV_SYSTEM_VAULT_WALLET_ID: string;

  let signerAPI: StardustSignerAPI;

  beforeAll(async () => {
    DEV_SYSTEM_VAULT_API_URL = String(process.env.DEV_SYSTEM_VAULT_API_URL);
    DEV_SYSTEM_VAULT_API_KEY = String(process.env.DEV_SYSTEM_VAULT_API_KEY);
    DEV_SYSTEM_VAULT_WALLET_ID = String(process.env.DEV_SYSTEM_VAULT_WALLET_ID);

    signerAPI = new StardustSignerAPI(DEV_SYSTEM_VAULT_API_KEY, DEV_SYSTEM_VAULT_API_URL);
  });

  describe('evm', () => {
    it('should sign a utf8 string', async () => {
      const params: SignRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        message: 'hello world',
        chainType: 'EVM',
      };

      const signature = await signerAPI.signMessage(params);
      expect(signature).toBe(
        '0xa713d11511710d0767e999bcfc0ca3b9f3ad8d38c80ca70f4311359aa9330fe90d69c5bdbf1b28364e883d6ad0d020717f1962977c4c8526a79c8d7380f81cd11b'
      );
    });

    it('should sign a hex encoded string', async () => {
      const params: SignRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        message: '0x68656c6c6f20776f726c64',
        chainType: 'EVM',
      };

      const signature = await signerAPI.signMessage(params);
      expect(signature).toBe(
        '0xa713d11511710d0767e999bcfc0ca3b9f3ad8d38c80ca70f4311359aa9330fe90d69c5bdbf1b28364e883d6ad0d020717f1962977c4c8526a79c8d7380f81cd11b'
      );
    });

    it('should return an address', async () => {
      const params: ApiRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        chainType: 'EVM',
      };

      const address = await signerAPI.getAddress(params);
      expect(address).toBe('0xc336b5005dEd82a5c4e89B7Ae8E0546BE50013b0');
    });

    it('should return a public key', async () => {
      const params: ApiRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        chainType: 'EVM',
      };

      const pubKey = await signerAPI.getPublicKey(params);
      expect(pubKey).toBe(
        '0x046d95408bd3a4efab65fe9a2182afa51d673c140e39b166095c4ca424df96d7c94d2b77b2bc5254f387ff1a35fd94b8e85d51de11fd50bc5e7a8cd41f12bcf100'
      );
    });
  });

  describe('sol', () => {
    it('should sign a utf8 string', async () => {
      const params: SignRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        message: 'hello world',
        chainType: 'sol',
      };

      const signature = await signerAPI.signMessage(params);
      expect(signature).toBe(
        '0x6F36AE842539336BFFFFF68998923A68720F55DFE04209F5A8DECA8E7B311823031BBF3E43BE0D6CC9562C58F5EFC2CBB95C0AE2A910D4149371D0F66CB89500'
      );
    });

    it('should sign a hex encoded string', async () => {
      const params: SignRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        message: '0x68656c6c6f20776f726c64',
        chainType: 'sol',
      };

      const signature = await signerAPI.signMessage(params);
      expect(signature).toBe(
        '0x6F36AE842539336BFFFFF68998923A68720F55DFE04209F5A8DECA8E7B311823031BBF3E43BE0D6CC9562C58F5EFC2CBB95C0AE2A910D4149371D0F66CB89500'
      );
    });

    it('should return an address', async () => {
      const params: ApiRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        chainType: 'sol',
      };

      const address = await signerAPI.getAddress(params);
      expect(address).toBe('GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx');
    });

    it('should return a public key', async () => {
      const params: ApiRequestPayload = {
        walletId: DEV_SYSTEM_VAULT_WALLET_ID,
        chainType: 'sol',
      };

      const pubKey = await signerAPI.getPublicKey(params);
      expect(pubKey).toBe('GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx');
    });
  });

  describe.skip('sui', () => {
    it('should sign a utf8 string', async () => {});
    it('should sign a hex encoded string', async () => {});
    it('should return an address', async () => {});
    it('should return a public key', async () => {});
  });
});
