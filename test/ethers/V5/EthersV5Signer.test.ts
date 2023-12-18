import dotenv from 'dotenv';
dotenv.config();

import { describe, expect, it } from '@jest/globals';
import EthersV5Signer from '../../../src/ethers/V5/EthersV5Signer';
import EvmStardustSigner from '../../../src/stardust/StardustSigners/evm/EvmStardustSigner';
import * as ethers_v5 from 'ethers_v5';

import {
  MOCKED_WALLET_ID,
  MOCKED_API_KEY,
  MOCKED_SERIALIZED_SIGNATURE,
  MOCKED_API_SIGNAURE,
  MOCKED_ADDRESS,
} from './constants';

jest.mock('../../../src/stardust/StardustSigners/evm/EvmStardustSigner', () => {
  return jest.fn().mockImplementation((walletId: string, apiKey: string) => {
    return {
      getAddress: jest.fn().mockResolvedValue(MOCKED_ADDRESS),
      signMessage: jest.fn().mockResolvedValue('mockedSignature'),
      signRaw: jest.fn().mockResolvedValue('mockedRawSignature'),
      api: {
        signTransaction: jest.fn().mockResolvedValue(MOCKED_API_SIGNAURE),
      },
      walletId: 'mockedWalletId',
    };
  });
});

async function createMockEthersV5Signer() {
  return new EthersV5Signer(new EvmStardustSigner(MOCKED_WALLET_ID, MOCKED_API_KEY));
}
describe('ethers_v5', () => {
  let ethersV5Signer: EthersV5Signer;

  beforeAll(async () => {
    ethersV5Signer = await createMockEthersV5Signer();
  });

  describe('v5', () => {
    describe('error cases', () => {
      it('should throw if the tx object has an invalid "from" address', async () => {
        const invalidFromAddress = '0xInvalidAddress';
        const tx = {
          from: invalidFromAddress,
          to: ethers_v5.constants.AddressZero,
          value: ethers_v5.utils.parseEther('1'),
        };

        try {
          await ethersV5Signer.signTransaction(tx);
          expect(true).toBe(false);
        } catch (error) {
          expect((error as Error).message).toContain('from address mismatch');
        }
      });
    });
    describe('use cases', () => {
      it('should delete the "from" property from the tx object if set', async () => {
        const tx = {
          from: MOCKED_ADDRESS,
          to: ethers_v5.constants.AddressZero,
          value: ethers_v5.utils.parseEther('1'),
        };
        const signature = await ethersV5Signer.signTransaction(tx);
        expect(signature).toBe(MOCKED_SERIALIZED_SIGNATURE);
      });

      it('should return the correct address when getAddress is called', async () => {
        const address = await ethersV5Signer.getAddress();
        expect(address).toBe(MOCKED_ADDRESS);
      });

      it('should sign a message and return the correct signature', async () => {
        const signature = await ethersV5Signer.signMessage('mockedMessage');
        expect(signature).toBe('mockedSignature');
      });

      it('should sign a tx object and return the correct signature', async () => {
        const tx = {
          to: ethers_v5.constants.AddressZero,
          value: ethers_v5.utils.parseEther('1'),
        };
        const signature = await ethersV5Signer.signTransaction(tx);
        expect(signature).toBe(MOCKED_SERIALIZED_SIGNATURE);
      });

      it('should sign raw data and return the correct signature', async () => {
        const signature = await ethersV5Signer.signRaw('mockedRawData');
        expect(signature).toBe('mockedRawSignature');
      });

      it('should connect to an RPC provider and return a signer instance', async () => {
        const provider = new ethers_v5.providers.JsonRpcProvider('http://localhost:8545');
        const signer = ethersV5Signer.connect(provider);
        expect(signer).toBeInstanceOf(EthersV5Signer);
      });
    });
  });
});
