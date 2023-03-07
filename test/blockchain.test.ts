import 'dotenv/config';
import { Provider } from '@ethersproject/abstract-provider';
import { StardustApp, StardustCustodialSDK } from '../src';

const polygonUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`;
const polygonBlockNumber = 40041083;
const hre = require('hardhat');
const hardhatEthersProvider: Provider = hre.ethers.provider;

const fundAccount = async (address: string, ether: string) => {
  const bank = (await hre.ethers.getSigners())[0];
  await bank.sendTransaction({ to: address, value: hre.ethers.utils.parseEther('1') });
};

// TODO: use fixtures
describe('Blockhain integration tests', () => {
  let apiKey: string;
  let walletId: string;
  beforeAll(async () => {
    await hre.network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: polygonUrl,
            blockNumber: polygonBlockNumber,
          },
        },
      ],
    });

    const app = new StardustApp('name', 'email', 'description');
    await StardustCustodialSDK.CreateApp(app);
    apiKey = app.apiKey!;
    const sdk = new StardustCustodialSDK(apiKey);
    const wallet = await sdk.createWallet();
    walletId = wallet.id;
  });
  it('should spin up hardhat network properly', async () => {
    const blockNumber = await hardhatEthersProvider.getBlockNumber();
    expect(blockNumber).toEqual(polygonBlockNumber);
  });

  it('Should fund the custodial wallet to use for testing', async () => {
    const sdk = new StardustCustodialSDK(apiKey);
    const wallet = await sdk.getWallet(walletId);
    const signer = wallet.signers.ethers.connect(hardhatEthersProvider);
    const address = await signer.getAddress();
    const custodialBalancePreFunding = await signer.getBalance();
    await fundAccount(address, '1');
    const custodialBalancePostFunding = await signer.getBalance();
    expect(custodialBalancePreFunding.toString()).toEqual('0');
    expect(custodialBalancePostFunding.toString()).toEqual(
      hre.ethers.utils.parseEther('1').toString()
    );
  });

  it('should allow us to send eth from a custodied address to another', async () => {
    //   first lets get the address of a custodial wallet
    const sdk = new StardustCustodialSDK(apiKey);
    const wallet = await sdk.getWallet(walletId);
    const signer = wallet.signers.ethers.connect(hardhatEthersProvider);
    const address = await signer.getAddress();
  });
});
