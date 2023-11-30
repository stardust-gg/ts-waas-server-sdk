import dotenv from 'dotenv';

import { verifyPersonalMessage } from '@mysten/sui.js/verify';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Setup constants
const STARDUST_API_KEY = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;

async function main() {
  try {
    // Create a StardustCustodialSdk instance
    const stardust = new StardustCustodialSDK(STARDUST_API_KEY);

    // Grab the relevant wallet
    const wallet = await stardust.getWallet(STARDUST_WALLET_ID);

    // Get the SUI address of the wallet (SUI specific)
    const address = await wallet.sui.getAddress();

    // Message to sign (application specific)
    const encoder = new TextEncoder();
    const msg = 'hello world';
    const encodedMsg = encoder.encode(msg);

    // Sign the personal message
    const sig = await wallet.sui.signPersonalMessage(encodedMsg);

    // Verify the personal message and get the recovered address
    const recoveredAddress = await verifyPersonalMessage(encodedMsg, sig);

    // Log the results
    console.log(`Signature: ${sig}`);
    console.log(`SUI Address: ${address}`);
    console.log(`Recovered Address: ${recoveredAddress.toSuiAddress()}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

main();
