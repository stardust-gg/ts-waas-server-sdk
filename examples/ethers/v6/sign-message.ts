import dotenv from 'dotenv';

import { ethers, getDefaultProvider } from 'ethers_v6';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

// Main function
async function main() {
  try {
    // Initialize Provider
    const provider = getDefaultProvider('mainnet');

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get wallet
    const profile = await sdk.getProfile(profileId);
    const { wallet } = profile;

    // Get V6 Signer
    const signer = wallet.ethers.v6.getSigner(provider);

    // Get Ethereum Address
    const ethAddress = await signer.getAddress();

    // Create a message to sign
    const message = 'hi';

    // Sign the message
    const sig = await signer.signMessage(message);

    // Verify the message and get the recovered address
    const recoveredAddress = ethers.verifyMessage(message, sig);

    // Log results
    console.log(`Ethereum Address: ${ethAddress}`);
    console.log(`Signed Message: ${message}`);
    console.log(`Signature: ${sig}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
