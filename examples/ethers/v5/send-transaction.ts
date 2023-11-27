import dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { StardustCustodialSDK, StardustWallet } from '../../../src';

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;

async function main() {
  try {
    // Initialize Provider
    const provider = new ethers.providers.AlchemyProvider('matic', process.env.ALCHEMY_API_KEY);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

    // Get V5 Signer
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // Create Transaction -- application specific
    const transaction = {
      to: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
      value: ethers.utils.parseEther('0.01'),
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
