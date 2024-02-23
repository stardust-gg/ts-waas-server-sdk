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

    // generate a jwt for the profile with a ttl
    const jwt = await sdk.generateProfileJWT(profileId, 3600);

    // check out how to use wallets in the wallet example
    console.log(`Profile jwt created: ${JSON.stringify(jwt)}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main();
