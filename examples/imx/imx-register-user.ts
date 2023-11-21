import { Config, ImmutableX, WalletConnection } from '@imtbl/core-sdk';
import { ethers } from 'ethers';
import { StardustCustodialSDK, StardustWallet } from '../../src';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

const apiKey = String(process.env.PROD_SYSTEM_STARDUST_API_KEY);
const walletId = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID);

const rpcUrl = 'https://ethereum-sepolia.publicnode.com'; // SANDBOX: must match network for imx config
// const rpcUrl = 'https://eth.public-rpc.com'; // PRODUCTION

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const main = async (apiKey: string, walletId: string) => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);

  // L1 Signer - imx requires an ethers v5 signer
  const signer = wallet.ethers.v5.getSigner().connect(provider);

  // L2 Imx Stark Signer
  const imxSigner = await wallet.imx.getSigner(signer);

  const walletConnection: WalletConnection = {
    ethSigner: signer,
    starkSigner: imxSigner,
  };

  let response;

  // Register them/check registration
  try {
    const imxClient = new ImmutableX(Config.SANDBOX);

    const ethAddress = await walletConnection.ethSigner.getAddress();
    response = await imxClient.getUser(ethAddress).then(async (res) => {
      if (res['accounts'].length === 0) {
        await imxClient.registerOffchain(walletConnection);
        console.log('Successfully registered user.');
      }
      return await imxClient.getUser(ethAddress);
    });

    return { accounts: response['accounts'] };
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main(apiKey, walletId);

export default main;
