/* eslint-disable no-unused-vars */
import { Provider } from 'ethers_v6';
import EthersV5Signer from '../ethers/V5/EthersV5Signer';
import EthersV6Signer from '../ethers/V6/EthersV6Signer';
import SuiStardustSigner from './StardustSigners/sui/SuiStardustSigner';
import ImxStardustSigner from './StardustSigners/evm/imx/ImxStardustSigner';
import EvmStardustSigner from './StardustSigners/evm/EvmStardustSigner';

export default class StardustWallet {
  public ethers: {
    v5: {
      getSigner: () => EthersV5Signer;
    };
    v6: {
      getSigner: (provider: Provider) => EthersV6Signer;
    };
  };
  public evm: EvmStardustSigner;
  public sui: SuiStardustSigner;
  public imx: ImxStardustSigner;

  constructor(
    public readonly id: string,
    public readonly apiKey: string,
    public readonly createdAt: Date,
    public readonly lastUsedAt: Date | null = null
  ) {
    this.ethers = {
      v5: {
        getSigner: () => new EthersV5Signer(this.evm),
      },
      v6: {
        getSigner: (provider) => new EthersV6Signer(this.evm, provider),
      },
    };

    this.evm = new EvmStardustSigner(id, apiKey);
    this.sui = new SuiStardustSigner(id, apiKey);
    this.imx = new ImxStardustSigner(id, apiKey);
  }
}
