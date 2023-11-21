import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../../../src';

// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

const apiKey = String(process.env.PROD_SYSTEM_STARDUST_API_KEY);
const walletId = String(process.env.PROD_SYSTEM_STARDUST_WALLET_ID);
// imx rpc
const rpcUrl = 'https://ethereum-sepolia.publicnode.com';
// const rpcUrl = 'https://eth.public-rpc.com';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const convertToHexIfUtf8 = (str: string): string => {
  const hexPattern = /^(0x)?[0-9a-fA-F]+$/;

  if (hexPattern.test(str)) {
    return str;
  }
  const buffer = Buffer.from(str, 'utf8');
  return `0x${buffer.toString('hex')}`;
};

const main = async (apiKey: string, walletId: string, provider: ethers.providers.Provider) => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);

  const signer = wallet.ethers.v5.getSigner().connect(provider);

  const ethAddress = await signer.getAddress();

  const message = 'hi';

  const sig = await signer.signMessage(message);

  const recoveredAddress = ethers.utils.verifyMessage(message, sig);

  return { sig, ethAddress, recoveredAddress };
};

main(apiKey, walletId, provider);

export default main;
