import BaseStardustAPI from '../../../src/stardust/Api/BaseStardustAPI';
import StardustApplication from '../../../src/stardust/Application/StardustApplication';
import StardustProfile from '../../../src/stardust/Profile/StardustProfile';
import StardustProfileAPI from '../../../src/stardust/Profile/StardustProfileAPI';
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

      it('should add an evm external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addEVMExternalWalletIdentifier(
          '0x698a3dD5aDCd91b17113E16E4cc47d8362E9B420'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(2);
        expect(identifier.type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifier.service).toBe('EVM');
        expect(identifier.value).toBe('0x698a3dD5aDCd91b17113E16E4cc47d8362E9B420');
      });

      it('should add a sui external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addSUIExternalWalletIdentifier(
          '0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(3);
        expect(identifiers[2].id).toBe(identifier.id);
        expect(identifiers[2].type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifiers[2].service).toBe('SUI');
        expect(identifiers[2].value).toBe(
          '0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866'
        );
      });

      it('should add a sol external wallet identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addSOLExternalWalletIdentifier(
          'GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx'
        );
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(4);
        expect(identifiers[3].id).toBe(identifier.id);
        expect(identifiers[3].type).toBe(StardustProfileIdentifierType.ExternalWallet);
        expect(identifiers[3].service).toBe('SOL');
        expect(identifiers[3].value).toBe('GoSReBzRojaCqMYhDK2ZzerqCVjyzeVuefwYrx8eZuqx');
      });

      it('should add a discord identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addDiscordIdentifier('123456789');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(5);
        expect(identifiers[4].id).toBe(identifier.id);
        expect(identifiers[4].service).toBe('discord');
        expect(identifiers[4].value).toBe('123456789');
      });

      it('should add an apple identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addAppleIdentifier('apple-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(6);
        expect(identifiers[5].id).toBe(identifier.id);
        expect(identifiers[5].service).toBe('apple');
        expect(identifiers[5].value).toBe('apple-identifier');
      });

      it('should add a google identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addGoogleIdentifier('google-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(7);
        expect(identifiers[6].id).toBe(identifier.id);
        expect(identifiers[6].service).toBe('google');
        expect(identifiers[6].value).toBe('google-identifier');
      });

      it('should add a facebook identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addFacebookIdentifier('facebook-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(8);
        expect(identifiers[7].id).toBe(identifier.id);
        expect(identifiers[7].service).toBe('facebook');
        expect(identifiers[7].value).toBe('facebook-identifier');
      });

      it('should add a twitter identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addTwitterIdentifier('twitter-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(9);
        expect(identifiers[8].id).toBe(identifier.id);
        expect(identifiers[8].service).toBe('twitter');
        expect(identifiers[8].value).toBe('twitter-identifier');
      });

      it('should add an email identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addEmailIdentifier('email-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(10);
        expect(identifiers[9].id).toBe(identifier.id);
        expect(identifiers[9].service).toBe('email');
        expect(identifiers[9].value).toBe('email-identifier');
      });

      it('should add a phone identifier to a profile', async () => {
        const profile = await sdk.getProfile(profileId);
        profile.stardustProfileIdentifierAPI = new StardustProfileIdentifierAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const identifier = await profile.addPhoneIdentifier('phone-identifier');
        expect(identifier).toBeDefined();
        const identifiers = await profile.getIdentifiers();
        expect(identifiers).toBeDefined();
        expect(identifiers.length).toBe(11);
        expect(identifiers[10].id).toBe(identifier.id);
        expect(identifiers[10].service).toBe('phone');
        expect(identifiers[10].value).toBe('phone-identifier');
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

      it('should sign with aptos signer', async () => {
        const wallet = await sdk.getWallet(DEV_SYSTEM_STARDUST_WALLET_ID);
        wallet.aptos.stardustSignerAPI = new StardustSignerAPI(
          DEV_SYSTEM_STARDUST_API_KEY,
          DEV_SYSTEM_STARDUST_API_URL
        );
        const signatureFromUint8 = await wallet.aptos.signRaw(new Uint8Array([1, 2, 3, 4]));
        const signautreFromMessageString = await wallet.aptos.signMessage('hello world');
        expect(signatureFromUint8).toBe(
          '0xAB4695A392C9F1C3815294F462B68EB58F82B4C6E9E945B858895C36B25122BB5BE4735310D7283153A4F44E2942635BE8043989F665905776D8B1996E035306'
        );
        expect(signautreFromMessageString).toBe(
          '0x20795FA59BCD3D87D122142D09589892FFECF3827E71BD9626132A5CD1471056829BF07DA9858A2315CA9FC7D074B1DD721E41FD843C040FCC32A45A31FFE001'
        );
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

    describe('aptos', () => {
      it('should sign a utf8 string', async () => {
        const params: SignRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          message: 'hello world',
          chainType: 'aptos',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x20795FA59BCD3D87D122142D09589892FFECF3827E71BD9626132A5CD1471056829BF07DA9858A2315CA9FC7D074B1DD721E41FD843C040FCC32A45A31FFE001'
        );
      });

      it('should sign a hex encoded string', async () => {
        const params: SignRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          message: '0x68656c6c6f20776f726c64',
          chainType: 'aptos',
        };

        const signature = await signerAPI.signMessage(params);
        expect(signature).toBe(
          '0x20795FA59BCD3D87D122142D09589892FFECF3827E71BD9626132A5CD1471056829BF07DA9858A2315CA9FC7D074B1DD721E41FD843C040FCC32A45A31FFE001'
        );
      });

      it('should return an address', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'aptos',
        };

        const address = await signerAPI.getAddress(params);
        expect(address).toBe('0xc50625a7bba25555614f3e9b7e1d1a7905a08dc4b82b5e5b9ad10bf996b2c646');
      });

      it('should return a public key', async () => {
        const params: ApiRequestPayload = {
          walletId: DEV_SYSTEM_STARDUST_WALLET_ID,
          chainType: 'aptos',
        };

        const pubKey = await signerAPI.getPublicKey(params);
        expect(pubKey).toBe('0x7488b16e6e30a2975a4dc0f7d51032ba2964978e1c7bbd6b7c0bac840eb2a6dd');
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

      it('should return an expanded wallet with address attached', async () => {
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
});
