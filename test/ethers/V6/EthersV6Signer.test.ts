import dotenv from 'dotenv';
dotenv.config();

import { describe, expect, it } from '@jest/globals';
import EthersV6Signer from '../../../src/ethers/V6/EthersV6Signer';
import EvmStardustSigner from '../../../src/stardust/Signers/evm/EvmStardustSigner';
import * as ethers_v6 from 'ethers_v6';
import { TypedDataDomain, TypedDataField, ethers } from 'ethers_v6';
import {
  MOCKED_WALLET_ID,
  MOCKED_API_KEY,
  MOCKED_SERIALIZED_SIGNATURE,
  MOCKED_API_SIGNAURE,
  RPC_URL,
  MOCKED_ADDRESS,
  MOCKED_SERIALIZED_TYPED_DATA_SIGNATURE,
} from './constants';

jest.mock('../../../src/stardust/Signers/evm/EvmStardustSigner', () => {
  return jest.fn().mockImplementation((walletId: string, apiKey: string) => {
    return {
      getAddress: jest.fn().mockResolvedValue(MOCKED_ADDRESS),
      signMessage: jest.fn().mockResolvedValue('mockedSignature'),
      signRaw: jest.fn().mockResolvedValue('mockedRawSignature'),
      stardustSignerAPI: {
        signTransaction: jest.fn().mockResolvedValue(MOCKED_API_SIGNAURE),
      },
      walletId: 'mockedWalletId',
    };
  });
});

async function createMockEthersV6Signer() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new EthersV6Signer(new EvmStardustSigner(MOCKED_WALLET_ID, MOCKED_API_KEY), provider);
}

describe('ethers_v5', () => {
  let ethersV6Signer: EthersV6Signer;

  beforeAll(async () => {
    ethersV6Signer = await createMockEthersV6Signer();
  });

  describe('v6', () => {
    describe('error cases', () => {
      // Test case 2: Invalid from address
      it('should throw an error if "from" address does not match the signer address', async () => {
        const tx = {
          from: '0xE67f238a5BDcD8e921D20da3dBFB8Cd74C46e3f7',
          to: '0xC52d791FC3bcCf56268a450590552F70A27C325a',
          value: '1000000000',
        };

        try {
          await ethersV6Signer.signTransaction(tx);

          fail('Expected an error to be thrown');
        } catch (error) {
          expect((error as Error).message).toContain('transaction from address mismatch');
        }
      });
    });

    describe('use cases', () => {
      it('should delete "from" property if it matches the signer address', async () => {
        const tx = {
          from: '0xC52d791FC3bcCf56268a450590552F70A27C325a', // This should match the signer address
          to: '0xC52d791FC3bcCf56268a450590552F70A27C325a',
          value: '1000000000',
        };
        const result = await ethersV6Signer.signTransaction(tx);
        expect(tx.from).toBeUndefined();
      });

      it('should return the correct address when getAddress is called', async () => {
        const address = await ethersV6Signer.getAddress();
        expect(address).toBe(MOCKED_ADDRESS);
      });

      it('should sign a message and return the correct signature', async () => {
        const signature = await ethersV6Signer.signMessage('mockedMessage');
        expect(signature).toBe('mockedSignature');
      });

      it('should sign a tx object and return the correct signature', async () => {
        const tx = {
          to: ethers_v6.ZeroAddress,
          value: ethers_v6.parseEther('1'),
        };
        const signature = await ethersV6Signer.signTransaction(tx);
        expect(signature).toBe(MOCKED_SERIALIZED_SIGNATURE);
      });

      it('should connect to an RPC provider and return a signer instance', async () => {
        const provider = new ethers_v6.JsonRpcProvider(RPC_URL);
        const signer = ethersV6Signer.connect(provider);
        expect(signer).toBeInstanceOf(EthersV6Signer);
      });

      it('should sign typed data and return the correct signature', async () => {
        // Typed Data Domain and Types
        const domain: TypedDataDomain = {
          name: 'testing',
          version: '1',
          verifyingContract: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
        };

        const types: Record<string, TypedDataField[]> = {
          Order: [
            { name: 'buyer', type: 'address' },
            { name: 'seller', type: 'address' },
            { name: 'price', type: 'uint256' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
          ],
        };

        const value: Record<string, any> = {
          buyer: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
          seller: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
          price: '2',
          tokenId: '2',
          nonce: '3',
        };

        const signature = await ethersV6Signer.signTypedData(domain, types, value);
        expect(signature).toBe(MOCKED_SERIALIZED_TYPED_DATA_SIGNATURE);
      });

      it('should resolve ens names within typed data', async () => {
        const domain: TypedDataDomain = {
          name: 'testing',
          version: '1',
          verifyingContract: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
        };

        const types: Record<string, TypedDataField[]> = {
          Order: [
            { name: 'buyer', type: 'address' },
            { name: 'seller', type: 'address' },
            { name: 'price', type: 'uint256' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
          ],
        };

        const value: Record<string, any> = {
          buyer: 'andy.eth',
          seller: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
          price: '2',
          tokenId: '2',
          nonce: '3',
        };

        await ethersV6Signer.signTypedData(domain, types, value);
      });

      it('should resolve a to & from value when not provided - defined by provider', async () => {
        const tx = {
          value: ethers_v6.parseEther('0.001'),
        };
        await ethersV6Signer.signTransaction(tx);
      });
    });
  });
});
