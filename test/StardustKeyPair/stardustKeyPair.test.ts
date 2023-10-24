import { StardustApp, StardustCustodialSDK } from '../../src';
import 'dotenv/config';

describe('StardustKeyPair: sanitize message', () => {
  describe('use cases', () => {
    it('should sanitize a string message into a hex representation', async () => {
      const apiKey = process.env.API_KEY!;
      const walletId = process.env.WALLET_ID!;

      const app = await new StardustCustodialSDK(apiKey);
      const wallet = await app.getWallet(walletId);
      const keyPair = wallet.keyPairs.ed25519;

      const message = 'hello world';
      const sanitizedMessage = keyPair.sanitizeMessage(message);
      expect(sanitizedMessage).toEqual('0x68656c6c6f20776f726c64');
    });

    it('should keep the hex representation if passed as hex with 0x prefix', async () => {
      const apiKey = process.env.API_KEY!;
      const walletId = process.env.WALLET_ID!;

      const app = await new StardustCustodialSDK(apiKey);
      const wallet = await app.getWallet(walletId);
      const keyPair = wallet.keyPairs.ed25519;

      const message = '0x68656c6c6f20776f726c64';
      const sanitizedMessage = keyPair.sanitizeMessage(message);
      expect(sanitizedMessage).toEqual('0x68656c6c6f20776f726c64');
    });

    it('should treat a string as utf8 if no 0x prefix', async () => {
      const apiKey = process.env.API_KEY!;
      const walletId = process.env.WALLET_ID!;

      const app = await new StardustCustodialSDK(apiKey);
      const wallet = await app.getWallet(walletId);
      const keyPair = wallet.keyPairs.ed25519;

      const message = '68656c6c6f20776f726c64';
      const sanitizedMessage = keyPair.sanitizeMessage(message);
      expect(sanitizedMessage).toEqual('0x36383635366336633666323037373666373236633634');
    });

    it('should transform a uint8array into a hex representation', async () => {
      const apiKey = process.env.API_KEY!;
      const walletId = process.env.WALLET_ID!;

      const app = await new StardustCustodialSDK(apiKey);
      const wallet = await app.getWallet(walletId);
      const keyPair = wallet.keyPairs.ed25519;

      const message = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
      const sanitizedMessage = keyPair.sanitizeMessage(message);

      expect(sanitizedMessage).toEqual('0x68656c6c6f20776f726c64');
    });
  });
});
