import dotenv from 'dotenv';
dotenv.config();

import * as imx from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import StardustCustodialSDK from '../../src/stardust/StardustCustodialSDK';
import StardustWallet from '../../src/stardust/StardustWallet';

const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;

const run = async () => {
  // Initialize Stardust SDK
  const sdk = new StardustCustodialSDK(apiKey);

  // Get wallet
  const wallet: StardustWallet = await sdk.getWallet(walletId);

  const config = {
    apiAddress: 'https://api.x.immutable.com/v1',
    alchemyProviderUrl: 'https://eth-mainnet.g.alchemy.com/v2/ssNJKdz_3ZTmSpOx4oNz-0P2FDR26VH5',
    starkContractAddress: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9', // 0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef for ropsten
    registrationContractAddress: '0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c', // 0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864 for ropsten
    gasLimit: '5000000',
    gasPrice: '20000000000',
  };

  // Initialize provider
  const provider = new ethers.providers.JsonRpcProvider(config.alchemyProviderUrl);

  // Obtain L1 Signer (ethers v5)
  const signer = wallet.ethers.v5.getSigner().connect(provider);

  const params = {
    starkContractAddress: config.starkContractAddress,
    registrationContractAddress: config.registrationContractAddress,
    signer: signer,
    publicApiUrl: config.apiAddress,
    gasLimit: config.gasLimit,
    gasPrice: config.gasPrice,
  };

  const client = await imx.ImmutableXClient.build(params);

  console.log(
    `Stardust Custodial Wallet Address: ${
      client.address
    }, with signer address ${await signer.getAddress()}, with Stark Public Key: ${
      client.starkPublicKey
    }`
  );

  let isRegistered = await client.isRegistered({ user: client.address });

  if (!isRegistered) {
    console.log(`${client.address} is not registered! Registering now`);
    console.log({ etherKey: client.address.toLowerCase(), starkPublicKey: client.starkPublicKey });

    const tx = await client.registerImx({
      etherKey: client.address.toLowerCase(),
      starkPublicKey: client.starkPublicKey,
    });
    if (tx.tx_hash === '') {
      await sleep(1000);
    }
    isRegistered = await client.isRegistered({ user: client.address });
    if (!isRegistered) {
      console.log(`${client.address} is not registered! Stopping, please find error`);
      process.exit(0);
    } else {
      console.log(`Success, ${client.address} is registered!`);
    }
  }

  const reg = await client.isRegistered({ user: client.address });
  console.log(reg);
};

run();
