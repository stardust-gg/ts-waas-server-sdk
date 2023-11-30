import dotenv from 'dotenv';

import { ethers } from 'ethers';
import { StardustCustodialSDK, StardustWallet } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const rpcUrl = process.env.RPC_URL!;

async function main() {
  try {
    // Initialize Provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

    // Get V5 Signer
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // Get Ethereum Address
    const ethAddress = await signer.getAddress();

    // Sign a Message
    const message = 'hi';
    const sig = await signer.signMessage(message);

    // Verify the message and get the recovered address
    const recoveredAddress = ethers.utils.verifyMessage(message, sig);

    // Output
    console.log(`Ethereum Address: ${ethAddress}`);
    console.log(`Signed Message: ${message}`);
    console.log(`Signature: ${sig}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
