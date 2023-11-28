import ImxStardustSigner from '../../src/stardust/StardustSigners/imx/ImxStardustSigner';
import EthersV5Signer from '../../src/ethers/V5/EthersV5Signer';
import * as imx from '@imtbl/imx-sdk';

jest.mock('../../src/stardust/StardustSigners/evm/EvmStardustSigner', () => {
  return jest.fn().mockImplementation((walletId: string, apiKey: string) => {
    return {
      signMessage: jest.fn().mockResolvedValue(MOCKED_SIGNATURE),
      getAddress: jest.fn().mockResolvedValue(MOCKED_ADRESS),
    };
  });
});
import EvmStardustSigner from '../../src/stardust/StardustSigners/evm/EvmStardustSigner';
import { MOCKED_ADRESS, MOCKED_SIGNATURE } from './constants';

const mockedWalletId = '';
const mockedAPIKey = '';

describe('ImxStardustSigner', () => {
  it('should return an instance of an Imx Signer', async () => {
    const mockedEthersV5Signer = new EthersV5Signer(
      new EvmStardustSigner(mockedWalletId, mockedAPIKey)
    );
    const imxStardustSigner = new ImxStardustSigner(mockedEthersV5Signer);
    const imxSigner = await imxStardustSigner.getStarkSigner();
    expect(imxSigner).toBeDefined();
    expect(imxSigner).toBeInstanceOf(Object);
    expect(imxSigner).toHaveProperty('signMessage');
    expect(imxSigner).toHaveProperty('getAddress');
  });
});
