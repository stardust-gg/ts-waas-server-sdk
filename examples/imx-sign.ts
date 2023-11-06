/* eslint-disable import/no-extraneous-dependencies */
import { generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */

import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../src';

const apiKey = '';
const walletId = '';
const rpcUrl = '';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const main = async () => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);
  const signer = wallet.signers.ethers.connect(provider);

  // Get the legacy Stark private key
  const starkPrivateKey = await generateLegacyStarkPrivateKey(signer);
  console.log(`starkprivateKey`, starkPrivateKey);
};

main();
