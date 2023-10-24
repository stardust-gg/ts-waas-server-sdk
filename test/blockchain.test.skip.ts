import 'dotenv/config';
import { Provider } from '@ethersproject/abstract-provider';
import { StardustApp, StardustCustodialSDK } from '../src';

if (!process.env.ALCHEMY_POLYGON_API_KEY) {
  throw new Error('ALCHEMY_POLYGON_API_KEY is not set');
}
const polygonUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`;
const polygonBlockNumber = 40041083;
const hre = require('hardhat');

const hardhatEthersProvider: Provider = hre.ethers.provider;

const fundAccount = async (address: string, ether: string) => {
  const bank = (await hre.ethers.getSigners())[0];
  await bank.sendTransaction({ to: address, value: hre.ethers.utils.parseEther(ether) });
};

// TODO: use fixtures
describe('Blockchain integration tests', () => {
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

  it('should allow us to send eth from a custody address and verify the recipients balance increase', async () => {
    //   first lets get the address of a custodial wallet
    const sdk = new StardustCustodialSDK(apiKey);
    const wallet = await sdk.getWallet(walletId);
    const signer = wallet.signers.ethers.connect(hardhatEthersProvider);
    const address = await signer.getAddress();
    const recipient = hre.ethers.Wallet.createRandom().connect(hardhatEthersProvider);
    const initialBalance = hre.ethers.utils.formatEther(await recipient.getBalance());
    const sendValue: number = 0.1;
    await fundAccount(address, '1');
    const txn = await signer.sendTransaction({
      to: recipient.address,
      value: hre.ethers.utils.parseEther(sendValue.toString()),
    });
    await txn.wait(1);
    const finalBalance = hre.ethers.utils.formatEther(await recipient.getBalance());
    expect(finalBalance - initialBalance).toEqual(sendValue);
  });

  it('should be able to interact with usdc contract to send usdc', async () => {
    const sdk = new StardustCustodialSDK(apiKey);
    const wallet = await sdk.getWallet(walletId);
    const signer = wallet.signers.ethers.connect(hardhatEthersProvider);

    const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

    // ABI of the USDC token contract
    const usdcAbi = [
      'function balanceOf(address account) view returns (uint256)',
      'function transfer(address recipient, uint256 amount) returns (bool)',
    ];

    // Create an instance of the USDC token contract
    const usdcContract = new hre.ethers.Contract(usdcAddress, usdcAbi, signer);
    const myAddress = await signer.getAddress();
    const usdcXfer = '100';
    const usdcWhale = '0x33Aa0f00B75Bf69543f1351412FFF1e3A12D114a';
    const usdcWhaleBalance = await usdcContract.balanceOf(usdcWhale);
    expect(usdcWhaleBalance.toNumber()).toBeGreaterThan(1000);
    const impersonatedSigner = await hre.ethers.getImpersonatedSigner(usdcWhale);
    const impersonatedContract = new hre.ethers.Contract(usdcAddress, usdcAbi, impersonatedSigner);
    await impersonatedContract.transfer(myAddress, hre.ethers.utils.parseUnits(usdcXfer, 6));
    const myBalanceAfter = await usdcContract.balanceOf(myAddress);
    expect(myBalanceAfter.toNumber()).toEqual(hre.ethers.utils.parseUnits(usdcXfer, 6).toNumber());

    // now our legit signer has some usdc. Lets use our signer to send the usdc to another address
    // Transfer 10 USDC to another address
    const recipient2 = hre.ethers.Wallet.createRandom().connect(hardhatEthersProvider);
    const usdcXferAgain = '10';
    const amount = hre.ethers.utils.parseUnits(usdcXferAgain, 6);
    const tx = await usdcContract.transfer(recipient2.address, amount);
    await tx.wait(1);
    const recipientBalance = await usdcContract.balanceOf(recipient2.address);
    expect(recipientBalance.toNumber()).toEqual(
      hre.ethers.utils.parseUnits(usdcXferAgain, 6).toNumber()
    );
  }, 15000);
});
