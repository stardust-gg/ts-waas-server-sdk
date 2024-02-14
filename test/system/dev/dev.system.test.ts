import StardustApplication from '../../../src/stardust/Application/StardustApplication';
import StardustProfile from '../../../src/stardust/Profile/StardustProfile';
import StardustProfileIdentifierAPI from '../../../src/stardust/Profile/StardustProfileIdentifierAPI';
import StardustSignerAPI from '../../../src/stardust/Signers/StardustSignerAPI';
import StardustCustodialSDK from '../../../src/stardust/StardustCustodialSDK';
import { ApiRequestPayload, SignRequestPayload } from '../../../src/types';
import { describe, expect, it } from '@jest/globals';
// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

describe('System: DEV Signing Parity', () => {
  let DEV_SYSTEM_STARDUST_API_URL: string;
  let DEV_SYSTEM_STARDUST_API_KEY: string;
  let DEV_SYSTEM_STARDUST_WALLET_ID: string;
  let DEV_SYSTEM_STARDUST_APPLICATION_ID: string;

  let signerAPI: StardustSignerAPI;
  let sdk: StardustCustodialSDK;

  beforeAll(async () => {
    DEV_SYSTEM_STARDUST_API_URL = String(process.env.DEV_SYSTEM_STARDUST_API_URL);
    DEV_SYSTEM_STARDUST_API_KEY = String(process.env.DEV_SYSTEM_STARDUST_API_KEY);
    DEV_SYSTEM_STARDUST_WALLET_ID = String(process.env.DEV_SYSTEM_STARDUST_WALLET_ID);
    DEV_SYSTEM_STARDUST_APPLICATION_ID = String(process.env.DEV_SYSTEM_STARDUST_APPLICATION_ID);

    signerAPI = new StardustSignerAPI(DEV_SYSTEM_STARDUST_API_KEY, DEV_SYSTEM_STARDUST_API_URL);
    sdk = new StardustCustodialSDK(DEV_SYSTEM_STARDUST_API_KEY, DEV_SYSTEM_STARDUST_API_URL);
  });

  describe('SDK', () => {
    describe('Profiles', () => {
      let profileId: string;
      let profileIdentifierId: string;
      it('should create a new profile', async () => {
        const profile: StardustProfile = await sdk.createProfile(
          DEV_SYSTEM_STARDUST_APPLICATION_ID
        );
        expect(profile).toBeDefined();
        profileId = profile.id;
      });

      it('should get a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        expect(profile).toBeDefined();
      });

      it('should add a identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addIdentifier('email', 'test@test.com');
        profileIdentifierId = identifier.id;
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(1);
        expect(identifiers[0].id).toBe(identifier.id);
        expect(identifiers[0].service).toBe('email');
        expect(identifiers[0].value).toBe('test@test.com');
      });

      it('should get a profile identifier by identifier id', async () => {
        const profileIdentifier = await sdk.getProfileIdentifier(profileIdentifierId);
        expect(profileIdentifier).toBeDefined();
        expect(profileIdentifier.service).toBe('email');
        expect(profileIdentifier.value).toBe('test@test.com');
      });

      it('should add google identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const userGoogleValue = 'some-google-user-value';
        const identifier = await profile.addGoogle(userGoogleValue);
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(2);
        expect(identifiers[1].service).toBe('ts-sdk-google');
        expect(identifiers[1].value).toBe(userGoogleValue);
      });

      describe('wallet.profile', () => {
        it('should be able to use all profile directly off a wallet', async () => {});
      });
    });
  });

  describe('Wallets', () => {
    let walletId: string;
    let profileId: string;
    it('should create a new wallet', async () => {
      const wallet = await sdk.createWallet();
      expect(wallet).toBeDefined();
      walletId = wallet.id;
      profileId = wallet.profileId;
    });

    it('should get a wallet', async () => {
      const wallet = await sdk.getWallet(walletId);
      expect(wallet).toBeDefined();
    });

    describe('wallet.profile', () => {
      it('should be able to use all profile apis directly off a wallet', async () => {
        console.log('TODO');
      });
    });
  });

  describe('Application', () => {
    it('should get the application associated with the api key', async () => {
      const application: StardustApplication = await sdk.getApplication();
      expect(application).toBeDefined();
      expect(application.id).toBe(DEV_SYSTEM_STARDUST_APPLICATION_ID);
    });
  });

  describe('Signer API', () => {
    describe('evm', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'evm',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0xa713d11511710d0767e999bcfc0ca3b9f3ad8d38c80ca70f4311359aa9330fe90d69c5bdbf1b28364e883d6ad0d020717f1962977c4c8526a79c8d7380f81cd11b'
        );
      });

      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'evm',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0xa713d11511710d0767e999bcfc0ca3b9f3ad8d38c80ca70f4311359aa9330fe90d69c5bdbf1b28364e883d6ad0d020717f1962977c4c8526a79c8d7380f81cd11b'
        );
      });

      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'evm',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0xc336b5005dEd82a5c4e89B7Ae8E0546BE50013b0');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'evm',
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
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
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
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
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
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sol',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sol',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe('GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx');
      });
    });

    describe('sui', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'sui',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          'AG82roQlOTNr///2iZiSOmhyD1Xf4EIJ9ajeyo57MRgjAxu/PkO+DWzJVixY9e/Cy7lcCuKpENQUk3HQ9my4lQDqxMTicjiKhFswhJMm5QSaBwA36BzowUt1NAJlIskrVw=='
        );
      });

      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'sui',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          'AG82roQlOTNr///2iZiSOmhyD1Xf4EIJ9ajeyo57MRgjAxu/PkO+DWzJVixY9e/Cy7lcCuKpENQUk3HQ9my4lQDqxMTicjiKhFswhJMm5QSaBwA36BzowUt1NAJlIskrVw=='
        );
      });
      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sui',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'sui',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe('0xeac4c4e272388a845b30849326e5049a070037e81ce8c14b7534026522c92b57');
      });
    });
  });
});
