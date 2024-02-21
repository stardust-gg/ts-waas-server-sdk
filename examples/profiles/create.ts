import dotenv from 'dotenv';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;

async function main() {
  try {
    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey, process.env.PROD_SYSTEM_STARDUST_API_URL);

    // Get you application id
    const application = await sdk.getApplication();

    // Create a profile - naming is optional
    const profile = await sdk.createProfile(application.id, 'My Profile Name'); // can save profile.id for later access

    // check out how to use wallets in the wallet example
    console.log(`Profile created: ${JSON.stringify(profile)}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
