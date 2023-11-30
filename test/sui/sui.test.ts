// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

import { describe } from '@jest/globals';
import SuiStardustSigner from '../../src/stardust/StardustSigners/sui/SuiStardustSigner';

// Mock the StardustSignerAPI class
jest.mock('../../src/stardust/StardustSignerAPI', () => {
  return jest.fn().mockImplementation((apiKey: string) => ({
    getPublicKey: jest.fn().mockResolvedValue('mockedPublicKey'),
    signMessage: jest.fn().mockResolvedValue('mockedSignature'),
    getAddress: jest.fn().mockResolvedValue('mockedAddress'),
  }));
});

describe('sui', () => {
  let mockedWalletId: string;
  let mockedApiKey: string;
  let suistardustSigner: SuiStardustSigner;

  beforeAll(async () => {
    mockedWalletId = 'mockedWalletId';
    mockedApiKey = 'mockedApiKey';
    suistardustSigner = new SuiStardustSigner(mockedWalletId, mockedApiKey);
  });

  describe('getPublicKey', () => {
    it('should call the API method to get the public key', async () => {
      const publicKey = await suistardustSigner.getPublicKey();
      expect(publicKey).toBe('mockedPublicKey');
    });
  });

  describe('signRaw', () => {
    it('should call the API method to sign a raw message', async () => {
      const message = 'Hello, World!';
      const signature = await suistardustSigner.signRaw(message);
      expect(signature).toBe('mockedSignature');
    });

    it('should sign a uint8array message', async () => {
      const message = new Uint8Array([1, 2, 3]);
      const signature = await suistardustSigner.signRaw(message);
      expect(signature).toBe('mockedSignature');
    });
  });

  describe('signTransactionBlock', () => {
    it('should call signRaw with a blake2b digest', async () => {
      const mockBlake2b = jest.fn().mockReturnValue('mockedDigest');
      require('@noble/hashes/blake2b').blake2b = mockBlake2b;

      const builtTx = new Uint8Array([1, 2, 3]);
      const signature = await suistardustSigner.signTransactionBlock(builtTx);

      expect(mockBlake2b).toHaveBeenCalledWith(expect.any(Uint8Array), { dkLen: 32 });
      expect(signature).toBe('mockedSignature');
    });
  });

  describe('signPersonalMessage', () => {
    it('should call signRaw with a blake2b digest', async () => {
      const mockBlake2b = jest.fn().mockReturnValue('mockedDigest');
      require('@noble/hashes/blake2b').blake2b = mockBlake2b;

      const message = new Uint8Array([1, 2, 3]);
      const signature = await suistardustSigner.signPersonalMessage(message);

      expect(mockBlake2b).toHaveBeenCalledWith(expect.any(Uint8Array), { dkLen: 32 });
      expect(signature).toBe('mockedSignature');
    });
  });

  describe('getAddress', () => {
    it('should call the API method to get the address', async () => {
      const address = await suistardustSigner.getAddress();
      expect(address).toBe('mockedAddress');
    });
  });
});
