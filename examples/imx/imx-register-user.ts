import dotenv from 'dotenv';
dotenv.config();

import { Config, ImmutableX, StarkSigner, WalletConnection } from '@imtbl/core-sdk';
import { ethers } from 'ethers';
import { StardustCustodialSDK, StardustWallet } from '../../src';

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const rpcUrl = process.env.SANDBOX_IMX_RPC_URL!; // SANDBOX: must match network for imx config

// Main function
async function main() {
  try {
    // Initialize provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

    // Obtain L1 Signer (ethers v5)
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // Obtain L2 Imx Stark Signer - deterministic from L1 signer
    const imxSigner: StarkSigner = await wallet.imx.getSigner(signer);

    // Create a wallet connection object
    const walletConnection: WalletConnection = {
      ethSigner: signer,
      starkSigner: imxSigner,
    };

    // Initialize ImmutableX client
    const imxClient = new ImmutableX(Config.SANDBOX);

    // Get the Ethereum address associated with the signer
    const ethAddress = await walletConnection.ethSigner.getAddress();

    // Check if the user is registered with ImmutableX, if not, register them
    let response;
    try {
      response = await imxClient.getUser(ethAddress);
      if (response['accounts'].length === 0) {
        await imxClient.registerOffchain(walletConnection);
        console.log('Successfully registered user with ImmutableX.');
        response = await imxClient.getUser(ethAddress);
      }
    } catch (error) {
      if ((error as Error).message.includes('User not found')) {
        console.log('User not found on ImmutableX. Registering them now.');
        await imxClient.registerOffchain(walletConnection);
        console.log('Successfully registered user with ImmutableX.');
        response = await imxClient.getUser(ethAddress);
      } else {
        throw error;
      }
    }

    // Log results
    console.log(`User Accounts on ImmutableX: ${response['accounts']}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

main();
