import BaseStardustAPI from '../../../src/stardust/Api/BaseStardustAPI';
import StardustApplication from '../../../src/stardust/Application/StardustApplication';
import StardustProfile from '../../../src/stardust/Profile/StardustProfile';
import StardustProfileIdentifier from '../../../src/stardust/Profile/StardustProfileIdentifier';
import StardustProfileIdentifierAPI from '../../../src/stardust/Profile/StardustProfileIdentifierAPI';
import { StardustProfileIdentifierType } from '../../../src/stardust/Profile/Types';
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
        const profile: StardustProfile = await sdk.createProfile();
        expect(profile).toBeDefined();
        profileId = profile.id;
      });

      it('should create a new profile with a name', async () => {
        const profile: StardustProfile = await sdk.createProfile('test-profile');
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
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('email');
        expect(identifier.value).toBe('test@test.com');
      });

      it('should get a profile identifier by identifier id', async () => {
        const profileIdentifier = await sdk.getProfileIdentifier(profileIdentifierId);
        expect(profileIdentifier).toBeDefined();
        expect(profileIdentifier.service).toBe('email');
        expect(profileIdentifier.value).toBe('test@test.com');
        expect(profileIdentifier.type).toBe(StardustProfileIdentifierType.Custom);
      });

      it('should add an evm external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addEVMExternalWalletIdentifier(
          '0x698a3dD5aDCd91b17113E16E4cc47d8362E9B420'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(2);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifier.service).toBe('EVM');
        expect(identifier.value).toBe('0x698a3dD5aDCd91b17113E16E4cc47d8362E9B420');
      });

      it('should add a sui external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addSUIExternalWalletIdentifier(
          '0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(3);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifier.service).toBe('SUI');
        expect(identifier.value).toBe(
          '0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866'
        );
      });

      it('should add a sol external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addSOLExternalWalletIdentifier(
          'GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(4);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifier.service).toBe('SOL');
        expect(identifier.value).toBe('GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx');
      });

      it('should add a discord identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addDiscordIdentifier('123456789');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(5);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('discord');
        expect(identifier.value).toBe('123456789');
      });

      it('should add an apple identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addAppleIdentifier('apple-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(6);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('apple');
        expect(identifier.value).toBe('apple-identifier');
      });

      it('should add a google identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addGoogleIdentifier('google-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(7);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('google');
        expect(identifier.value).toBe('google-identifier');
      });

      it('should add a facebook identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addFacebookIdentifier('facebook-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(8);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('facebook');
        expect(identifier.value).toBe('facebook-identifier');
      });

      it('should add a twitter identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addTwitterIdentifier('twitter-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(9);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('twitter');
        expect(identifier.value).toBe('twitter-identifier');
      });

      it('should add an email identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addEmailIdentifier('email-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(10);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('email');
        expect(identifier.value).toBe('email-identifier');
      });

      it('should add a phone identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          PROD_SYSTEM_STARDUST_API_KEY,
          PROD_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addPhoneIdentifier('phone-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(11);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('phone');
        expect(identifier.value).toBe('phone-identifier');
      });

      it('should add a steam identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);

        const identifier = await profile.addSteamIdentifier('steam-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(12);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('steam');
        expect(identifier.value).toBe('steam-identifier');
      });

      it('should add a twitch identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);

        const identifier = await profile.addTwitchIdentifier('twitch-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(13);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('twitch');
        expect(identifier.value).toBe('twitch-identifier');
      });

      it('should add an epic identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);

        const identifier = await profile.addEpicIdentifier('epic-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(14);
        expect(identifier.id).toBe(identifier.id);
        expect(identifier.service).toBe('epic');
        expect(identifier.value).toBe('epic-identifier');
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

    describe('Profile events', () => {
      it('should fire an event to add an ip to a profile', async () => {
        const profile = await sdk.getProfile(PROD_SYSTEM_STARDUST_PROFILE_ID);
        await profile.events.addIp('97.197.26.199');
        await profile.events.addIp('2602:2c7:4381:6160:9ee8:f957:8f2:a109');
        await expect(profile.events.addIp('invalid-ip')).rejects.toThrowError();
      });

      it('should fire an event to add a purchase to a profile', async () => {
        const profile = await sdk.getProfile(PROD_SYSTEM_STARDUST_PROFILE_ID);
        await profile.events.addPurchase({
          itemId: 'arbitrary-id',
          amount: '100',
          currency: 'USD',
          anotherArbitraryProperty: 'yep',
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

      it('should sign with aptos signer', async () => {
        const wallet = await sdk.getWallet(PROD_SYSTEM_STARDUST_WALLET_ID);
        const signatureFromUint8 = await wallet.aptos.signRaw(new Uint8Array([1, 2, 3, 4]));
        const signautreFromMessageString = await wallet.aptos.signMessage('hello world');
        expect(signatureFromUint8).toBe(
          '0x8EB9D7FFB051423F33CA816B39D556D035054C15DC175849E7945294A9706531DAEDBC22A651D59EFCBD7AB94C118CA32F70CE246D104601052BFDD9A4F11301'
        );
        expect(signautreFromMessageString).toBe(
          '0x66F5B43DCED4053792148BE533D6B257AE841773CF9E8E5D900146EA7524E0F55F2F20E7E075AD87419AE877F64BD539A071BBD3C64F2AA1B49ABA7CA8404F0E'
        );
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

    describe('aptos', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'aptos',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x66F5B43DCED4053792148BE533D6B257AE841773CF9E8E5D900146EA7524E0F55F2F20E7E075AD87419AE877F64BD539A071BBD3C64F2AA1B49ABA7CA8404F0E'
        );
      });
      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'aptos',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x66F5B43DCED4053792148BE533D6B257AE841773CF9E8E5D900146EA7524E0F55F2F20E7E075AD87419AE877F64BD539A071BBD3C64F2AA1B49ABA7CA8404F0E'
        );
      });
      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'aptos',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0x43171a4fce80da99cb1976f6418a3b386c4b36c2529667ac925b2fefcb918463');
      });
      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: PROD_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'aptos',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe('0x0dcff96726d8a22d0275a80f4b1787d80933080da4af6711598dad8e4711951c');
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
