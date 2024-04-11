import dotenv from 'dotenv';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

async function main() {
  try {
    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    const profile = await sdk.getProfile(profileId);

    const address = await profile.wallets![0].evm.getAddress();

    console.log(address);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
