import 'dotenv/config';
import { ethers } from 'ethers_v5';
import { keccak256, parseTransaction, splitSignature } from 'ethers/lib/utils';
import { serialize, UnsignedTransaction } from '@ethersproject/transactions';
import { SignatureLike } from '@ethersproject/bytes';
import {
  StardustCustodialSDK,
  StardustApp,
  StardustWallet,
  convertStringToHexString,
} from '../../src';
import HexString from '../../src/utils/HexString';

const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
describe('e2e', () => {
  let apiKey: string;
  let walletId: string;
  describe('basic create and get flows', () => {
    it('should create an app in the Stardust database', async () => {
      apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
      walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
    });

    it('should retrieve an app from the Stardust database', async () => {
      const sdk = new StardustCustodialSDK(apiKey);
      const app = await sdk.getApp();
      expect(app).toBeDefined();
      expect(app.name).toBeDefined();
      expect(app.email).toBeDefined();
      expect(app.description).toBeDefined();
      expect(app.id).toMatch(uuidRegex);
      expect(app.apiKey).toMatch(uuidRegex);
    });

    it('should create a wallet in the Stardust database', async () => {
      const sdk = new StardustCustodialSDK(apiKey);
      const wallet = await sdk.createWallet();
      walletId = wallet.id;
      expect(wallet).toBeDefined();
      expect(wallet.id).toMatch(uuidRegex);
      expect(wallet.createdAt).toBeInstanceOf(Date);
    });

    it('should retrieve a wallet from the Stardust database', async () => {
      const sdk = new StardustCustodialSDK(apiKey);
      const wallet = await sdk.getWallet(walletId);
      expect(wallet).toBeDefined();
      expect(wallet.id).toMatch(walletId);
      expect(wallet.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('e2e - signer flows', () => {
    let stardustWallet: StardustWallet;
    const provider = new ethers.providers.JsonRpcProvider(
      'https://api.avax-test.network/ext/bc/C/rpc'
    );
    it('should allow us to connect a wallet to a provider', async () => {
      const sdk = new StardustCustodialSDK(apiKey);
      stardustWallet = await sdk.getWallet(walletId);

      const signer = stardustWallet.ethers.v5.getSigner().connect(provider);
      expect(await signer.getChainId()).not.toBeNull();
      expect(stardustWallet.ethers.v5.getSigner()).toBeDefined();
    });

    it('Should allow us to get our on chain address', async () => {
      const signer = stardustWallet.ethers.v5.getSigner().connect(provider); // signer connected in last test
      const address = await signer.getAddress();
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('Should return the same address if we call getAddress() twice', async () => {
      const signer = stardustWallet.ethers.v5.getSigner().connect(provider); // signer connected in last test
      const address = await signer.getAddress();
      const address2 = await signer.getAddress();
      expect(address).toEqual(address2);
    });

    it('Should sign a message and verify it was signed by the correct address', async () => {
      const signer = stardustWallet.ethers.v5.getSigner().connect(provider); // signer connected in last test
      const message = '0x1234';
      const signature = await signer.signMessage(message);
      const expectedAddress = await signer.getAddress();
      const messagePrefix = '\x19Ethereum Signed Message:\n';
      const messageLen = String(new HexString(message).length);
      const prefixedMsg =
        convertStringToHexString(messagePrefix) +
        new HexString(convertStringToHexString(messageLen)).strip() +
        new HexString(message).strip();
      const recoveredAddress = ethers.utils.recoverAddress(
        ethers.utils.keccak256(prefixedMsg),
        signature
      );
      expect(recoveredAddress).toEqual(expectedAddress);
    });

    it('Should sign a transaction and verify it was signed by the correct address', async () => {
      const signer = stardustWallet.ethers.v5.getSigner().connect(provider); // signer connected in last test
      const address = await signer.getAddress();

      const txn = {
        gasPrice: '',
        gasLimit: '',
        to: '0x08505F42D5666225d5d73B842dAdB87CCA44d1AE',
        value: '',
        data: '',
        chainId: 0,
      };
      const signature = await signer.signTransaction(txn);
      const transaction = parseTransaction(signature);
      const sig2 = splitSignature(<SignatureLike>transaction);
      const recreatedDigest = keccak256(serialize(<UnsignedTransaction>txn));
      const recoveredAddress = ethers.utils.recoverAddress(recreatedDigest, sig2);
      expect(address).toEqual(recoveredAddress);
    });
  });
});
