import dotenv from 'dotenv';

import { ethers } from 'ethers_v5';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;
const rpcUrl = process.env.RPC_URL!;

async function main() {
  try {
    // Initialize Provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const profile = await sdk.getProfile(profileId);
    const { wallet } = profile;

    // Get V5 Signer
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // Get Ethereum Address
    const ethAddress = await signer.getAddress();

    // Sign a Message
    const message = 'dd745934ebca355dac9bb4ba11ff69c843fbdda6175dfb8352051fa63e3dee2a';
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
