/* eslint-disable no-unused-vars */
import { Provider } from 'ethers_v6';
import EthersV5Signer from '../../ethers/V5/EthersV5Signer';
import EthersV6Signer from '../../ethers/V6/EthersV6Signer';
import SuiStardustSigner from '../Signers/sui/SuiStardustSigner';
import ImxStardustSigner from '../Signers/imx/ImxStardustSigner';
import EvmStardustSigner from '../Signers/evm/EvmStardustSigner';
import StardustApplication from '../Application/StardustApplication';
// eslint-disable-next-line import/no-cycle
import StardustProfileAPI from '../Profile/StardustProfileAPI';
import StardustProfile from '../Profile/StardustProfile';
import { StardustWalletData } from './Types';
import SolStardustSigner from '../Signers/sol/SolStardustSigner';
import AptosStardustSigner from '../Signers/aptos/AptosStardustSigner';

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

  public sol: SolStardustSigner;

  public aptos: AptosStardustSigner;

  public imx: ImxStardustSigner;

  public stardustProfileAPI: StardustProfileAPI;

  constructor(
    public readonly id: string,
    public readonly profileId: string,
    public readonly application: StardustApplication,
    public readonly createdAt: Date,
    public readonly lastUsedAt: Date | null = null,
    apiKey: string | null = null
  ) {
    this.ethers = {
      v5: {
        getSigner: () => new EthersV5Signer(this.evm),
      },
      v6: {
        getSigner: (provider) => new EthersV6Signer(this.evm, provider),
      },
    };

    this.evm = new EvmStardustSigner(id, apiKey!);
    this.sui = new SuiStardustSigner(id, apiKey!);
    this.sol = new SolStardustSigner(id, apiKey!);
    this.aptos = new AptosStardustSigner(id, apiKey!);
    this.imx = new ImxStardustSigner(this.ethers.v5.getSigner());
    this.stardustProfileAPI = new StardustProfileAPI(apiKey!);
  }

  public async getProfile(): Promise<StardustProfile> {
    return this.stardustProfileAPI.get(this.profileId);
  }

  public static generate(walletData: StardustWalletData): StardustWallet {
    return new StardustWallet(
      walletData.id,
      walletData.profileId,
      StardustApplication.generate({ ...walletData.application, apiKey: walletData.apiKey }),
      new Date(walletData.createdAt),
      walletData.lastUsedAt ? new Date(walletData.lastUsedAt) : null,
      walletData.apiKey
    );
  }

  public toJson(): any {
    return {
      id: this.id,
      profileId: this.profileId,
      application: this.application.toJson(),
      evm: this.evm.toJson(),
      sui: this.sui.toJson(),
      sol: this.sol.toJson(),
      aptos: this.aptos.toJson(),
      imx: this.imx.toJson(),
      createdAt: this.createdAt,
      lastUsedAt: this.lastUsedAt,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}
