import BaseStardustAPI from '../../../src/stardust/Api/BaseStardustAPI';
import StardustApplication from '../../../src/stardust/Application/StardustApplication';
import StardustProfile from '../../../src/stardust/Profile/StardustProfile';
import StardustProfileAPI from '../../../src/stardust/Profile/StardustProfileAPI';
import StardustProfileIdentifier from '../../../src/stardust/Profile/StardustProfileIdentifier';
import StardustProfileIdentifierAPI from '../../../src/stardust/Profile/StardustProfileIdentifierAPI';
import {
  StardustExternalWalletChainType,
  StardustProfileIdentifierType,
} from '../../../src/stardust/Profile/Types';
import StardustSignerAPI from '../../../src/stardust/Signers/StardustSignerAPI';
import StardustCustodialSDK from '../../../src/stardust/StardustCustodialSDK';
import StardustWallet from '../../../src/stardust/Wallet/StardustWallet';
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
  let DEV_SYSTEM_STARDUST_PROFILE_ID: string;

  let signerAPI: StardustSignerAPI;
  let sdk: StardustCustodialSDK;

  beforeAll(async () => {
    DEV_SYSTEM_STARDUST_API_URL = String(process.env.DEV_SYSTEM_STARDUST_API_URL);
    DEV_SYSTEM_STARDUST_API_KEY = String(process.env.DEV_SYSTEM_STARDUST_API_KEY);
    DEV_SYSTEM_STARDUST_WALLET_ID = String(process.env.DEV_SYSTEM_STARDUST_WALLET_ID);
    DEV_SYSTEM_STARDUST_APPLICATION_ID = String(process.env.DEV_SYSTEM_STARDUST_APPLICATION_ID);
    DEV_SYSTEM_STARDUST_PROFILE_ID = String(process.env.DEV_SYSTEM_STARDUST_PROFILE_ID);

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

      it('should create a new profile with a name', async () => {
        const profile: StardustProfile = await sdk.createProfile(
          DEV_SYSTEM_STARDUST_APPLICATION_ID,
          'test-profile'
        );
        expect(profile).toBeDefined();
        expect(profile.name).toBe('test-profile');
      });

      it('should get a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        expect(profile).toBeDefined();
      });

      it('should add a custom identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addCustomIdentifier('email', 'test@test.com');
        profileIdentifierId = identifier.id;

        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(1);
        expect(identifiers[0].type).toBe(StardustProfileIdentifierType.Custom);
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

      it('should add an external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addExternalWalletIdentifier(
          StardustExternalWalletChainType.EVM,
          '0x698a3dD5aDCd91b17113E16E4cc47d8362E9B420'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(2);
        expect(identifiers[1].id).toBe(identifier.id);
        expect(identifiers[1].type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifiers[1].service).toBe('EVM');
        expect(identifiers[1].value).toBe('0x698a3dD5aDCd91b17113E16E4cc47d8362E9B420');
      });

      it('should generate a client jwt', async () => {
        const jwt = await sdk.generateProfileJWT(profileId, 3600);
        expect(jwt).toBeDefined();
      });

      describe('profile.wallet', () => {
        it('should properly populate a profile with wallet and identifiers when using sdk.getProfile() call', async () => {
          const profile = await sdk.getProfile(profileId);
          expect(profile).toBeInstanceOf(StardustProfile);
          expect(profile.wallet).toBeInstanceOf(StardustWallet);
          expect(profile.identifiers![0]).toBeInstanceOf(StardustProfileIdentifier);
          expect(profile.identifiers![1]).toBeInstanceOf(StardustProfileIdentifier);
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

      describe('wallet.getProfile()', () => {
        it('should be able to use all profile apis directly off a wallet.getProfile() call', async () => {
          const wallet = await sdk.getWallet(walletId);
          wallet.stardustProfileAPI = new StardustProfileAPI(
            DEV_SYSTEM_STARDUST_API_KEY,
            DEV_SYSTEM_STARDUST_API_URL
          );
          const profile = await wallet.getProfile();
          expect(profile).toBeInstanceOf(StardustProfile);
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

    describe('Signers', () => {
      it('should sign with solana signer', async () => {
        const wallet = await sdk.getWallet(DEV_SYSTEM_STARDUST_WALLET_ID);
        wallet.sol.stardustSignerAPI = new StardustSignerAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const signature = await wallet.sol.signMessage('hello world');
        expect(signature).toBeDefined();
      });
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

  describe('Additional System QA', () => {
    let baseAPI: BaseStardustAPI;
    beforeAll(() => {
      baseAPI = new BaseStardustAPI(DEV_SYSTEM_STARDUST_API_KEY, DEV_SYSTEM_STARDUST_API_URL);
    });

    it('should return an expanded wallet with profile attached', async () => {
      const expandedWalletWithProfileResp = await baseAPI.api.get(
        `wallet/${DEV_SYSTEM_STARDUST_WALLET_ID}?expand=profile`
      );
      expect(expandedWalletWithProfileResp.profile).toBeDefined();
    });

    it('should return and expanded wallet with address attached', async () => {
      const expandedWalletWithAddressResp = await baseAPI.api.get(
        `wallet/${DEV_SYSTEM_STARDUST_WALLET_ID}?includeAddresses=evm`
      );
      expect(expandedWalletWithAddressResp.addresses).toBeDefined();
    });

    it('should return expanded wallets with addresses and profiles attached when using list endpoint', async () => {
      const expandedWalletsResp = await baseAPI.api.get(
        `wallet?start=0&limit=100&applicationId=${DEV_SYSTEM_STARDUST_APPLICATION_ID}&profileId=${DEV_SYSTEM_STARDUST_PROFILE_ID}&expand=profile&includeAddresses=evm`
      );
      expect(expandedWalletsResp.results[0].addresses).toBeDefined();
      expect(expandedWalletsResp.results[0].profile).toBeDefined();
    });

    it('should return an expanded profile with wallet attached', async () => {
      const expandedProfileWithWalletResp = await baseAPI.api.get(
        `profile/${DEV_SYSTEM_STARDUST_PROFILE_ID}?expand=wallets`
      );
      expect(expandedProfileWithWalletResp.wallets).toBeDefined();
    });
  });
});
