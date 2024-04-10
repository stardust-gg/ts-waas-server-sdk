import BaseStardustAPI from '../../../src/stardust/Api/BaseStardustAPI';
import StardustApplication from '../../../src/stardust/Application/StardustApplication';
import StardustProfile from '../../../src/stardust/Profile/StardustProfile';
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

describe('System: PROD Signing Parity', () => {
  let PROD_SYSTEM_STARDUST_API_URL: string;
  let PROD_SYSTEM_STARDUST_API_KEY: string;
  let PROD_SYSTEM_STARDUST_WALLET_ID: string;
  let PROD_SYSTEM_STARDUST_APPLICATION_ID: string;
  let PROD_SYSTEM_STARDUST_PROFILE_ID: string;

  let signerAPI: StardustSignerAPI;
  let sdk: StardustCustodialSDK;

  beforeAll(async () => {
    PROD_SYSTEM_STARDUST_API_URL = String(process.env.PROD_SYSTEM_STARDUST_API_URL);
    PROD_SYSTEM_STARDUST_API_KEY = String(process.env.PROD_SYSTEM_STARDUST_API_KEY);
    PROD_SYSTEM_STARDUST_WALLET_ID = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID);
    PROD_SYSTEM_STARDUST_APPLICATION_ID = String(process.env.PROD_SYSTEM_STARDUST_APPLICATION_ID);
    PROD_SYSTEM_STARDUST_PROFILE_ID = String(process.env.PROD_SYSTEM_STARDUST_PROFILE_ID);

    signerAPI = new StardustSignerAPI(PROD_SYSTEM_STARDUST_API_KEY, PROD_SYSTEM_STARDUST_API_URL);
    sdk = new StardustCustodialSDK(PROD_SYSTEM_STARDUST_API_KEY);
  });

  describe('SDK', () => {
    describe('Profiles', () => {
      let profileId: string;
      let profileIdentifierId: string;
      it('should create a new profile', async () => {
        const profile: StardustProfile = await sdk.createProfile(
          PROD_SYSTEM_STARDUST_APPLICATION_ID
        );
        expect(profile).toBeDefined();
        profileId = profile.id;
      });

      it('should create a new profile with a name', async () => {
        const profile: StardustProfile = await sdk.createProfile(
          PROD_SYSTEM_STARDUST_APPLICATION_ID,
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
        const identifier = await profile.addCustomIdentifier('email', 'test@test.com');
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
        expect(profileIdentifier.type).toBe(StardustProfileIdentifierType.Custom);
      });

      it('should add an external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
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
          const profile = await wallet.getProfile();
          expect(profile).toBeInstanceOf(StardustProfile);
        });
      });
    });

    describe('Application', () => {
      it('should get the application associated with the api key', async () => {
        const application: StardustApplication = await sdk.getApplication();
        expect(application).toBeDefined();
        expect(application.id).toBe(PROD_SYSTEM_STARDUST_APPLICATION_ID);
      });
    });

    describe('Signers', () => {
      it('should sign with solana signer', async () => {
        const wallet = await sdk.getWallet(PROD_SYSTEM_STARDUST_WALLET_ID);
        wallet.sol.stardustSignerAPI = new StardustSignerAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
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
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'evm',
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
          chainType: 'evm',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x96f2b95279b7bb7e0e7bc8b688afa3ae8a14d359067ff3ee4e24a69a6e7309e23941660f1efbce8eb2327446204577840f7644ad621a4c0793ff4ab82289895b1c'
        );
      });

      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'evm',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0x2210FA04B60d6846552F889DCde641022648F493');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'evm',
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

  describe('Additional System QA', () => {
    let baseAPI: BaseStardustAPI;
    beforeAll(() => {
      baseAPI = new BaseStardustAPI(PROD_SYSTEM_STARDUST_API_KEY, PROD_SYSTEM_STARDUST_API_URL);
    });

    it('should return an expanded wallet with profile attached', async () => {
      const expandedWalletWithProfileResp = await baseAPI.api.get(
        `wallet/${PROD_SYSTEM_STARDUST_WALLET_ID}?expand=profile`
      );
      expect(expandedWalletWithProfileResp.profile).toBeDefined();
    });

    it('should return and expanded wallet with address attached', async () => {
      const expandedWalletWithAddressResp = await baseAPI.api.get(
        `wallet/${PROD_SYSTEM_STARDUST_WALLET_ID}?includeAddresses=evm`
      );
      expect(expandedWalletWithAddressResp.addresses).toBeDefined();
    });

    it('should return expanded wallets with addresses and profiles attached when using list endpoint', async () => {
      const expandedWalletsResp = await baseAPI.api.get(
        `wallet?start=0&limit=100&applicationId=${PROD_SYSTEM_STARDUST_APPLICATION_ID}&profileId=${PROD_SYSTEM_STARDUST_PROFILE_ID}&expand=profile&includeAddresses=evm`
      );
      expect(expandedWalletsResp.results[0].addresses).toBeDefined();
      expect(expandedWalletsResp.results[0].profile).toBeDefined();
    });

    it('should return an expanded profile with wallet attached', async () => {
      const expandedProfileWithWalletResp = await baseAPI.api.get(
        `profile/${PROD_SYSTEM_STARDUST_PROFILE_ID}?expand=wallets`
      );
      expect(expandedProfileWithWalletResp.wallets).toBeDefined();
    });
  });
});
