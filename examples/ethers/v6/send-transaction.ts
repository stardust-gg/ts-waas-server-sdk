import dotenv from 'dotenv';

import { ethers, getDefaultProvider } from 'ethers_v6';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

async function main() {
  try {
    // Initialize Provider
    const provider = getDefaultProvider('matic');

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const profile = await sdk.getProfile(profileId);
    const { wallet } = profile;

    // Get V6 Signer
    const signer = wallet.ethers.v6.getSigner(provider);

    // Create Transaction -- application specific
    const transaction = {
      to: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
      value: ethers.parseEther('0.01'),
      data: '0xe6',
    };

    // Send Transaction
    const sentTx = await signer.sendTransaction(transaction);
    await sentTx.wait();

    // Log results
    console.log(`Sent tx object ${JSON.stringify(sentTx)}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
