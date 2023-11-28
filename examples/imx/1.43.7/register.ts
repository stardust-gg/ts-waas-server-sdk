import dotenv from 'dotenv';
dotenv.config();

import * as imx from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import StardustCustodialSDK from '../../../src/stardust/StardustCustodialSDK';
import StardustWallet from '../../../src/stardust/StardustWallet';

const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;

async function main() {
  try {
    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

    // Initialize provider
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`
    );

    // Obtain L1 Signer (ethers v5)
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // IMX Configuration
    const imxConfig = {
      apiAddress: 'https://api.x.immutable.com/v1',
      starkContractAddress: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
      registrationContractAddress: '0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c',
    };

    // Setup params using config and L1 Signer
    const params = {
      starkContractAddress: imxConfig.starkContractAddress,
      registrationContractAddress: imxConfig.registrationContractAddress,
      signer: signer,
      publicApiUrl: imxConfig.apiAddress,
    };

    // Connect to IMX client
    const imxClient = await imx.ImmutableXClient.build(params);

    // Check registration status
    let isRegistered = await imxClient.isRegistered({ user: await signer.getAddress() });
    if (!isRegistered) {
      console.log(`Wallet ${await signer.getAddress()} is not registered. Registering now...`);

      // Register on IMX
      const registrationResult = await imxClient.registerImx({
        etherKey: await signer.getAddress(),
        starkPublicKey: imxClient.starkPublicKey,
      });

      if (registrationResult.tx_hash === '') {
        await sleep(1000); // Wait for the transaction to be processed
      }

      isRegistered = await imxClient.isRegistered({ user: await signer.getAddress() });
      if (!isRegistered) {
        throw new Error('Registration failed. Please check the transaction details.');
      }

      console.log(`Wallet ${await signer.getAddress()} successfully registered.`);
    } else {
      console.log(`Wallet ${await signer.getAddress()} is already registered.`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main();

// Stardust Custodial Wallet Address: 0x2210fa04b60d6846552f889dcde641022648f493, with signer address 0x2210FA04B60d6846552F889DCde641022648F493, with Stark Public Key: 0x020e4b0e5a26da10d87f9b136a06d7c0d0b8a847a26d5bd0816d932e1e3c5a63
// 0x2210fa04b60d6846552f889dcde641022648f493 is not registered! Registering now
// {
//   etherKey: '0x2210fa04b60d6846552f889dcde641022648f493',
//   starkPublicKey: '0x020e4b0e5a26da10d87f9b136a06d7c0d0b8a847a26d5bd0816d932e1e3c5a63'
// }
// Success, 0x2210fa04b60d6846552f889dcde641022648f493 is registered!
// true
