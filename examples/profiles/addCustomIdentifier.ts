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

    // Create a profile - naming is optional
    const profile = await sdk.getProfile(profileId); // can save profile.id for later access

    const userInputGoogleId = '1234567890';
    // PLAYER PROMPTED TO ADD SOCIAL

    // add specific social
    const social = userInputGoogleId;
    const serviceName = '<CUSTOM-SERVICE-NAME>';
    const profileIdentifier = await profile.addCustomIdentifier(serviceName, social);

    // check out how to use wallets in the wallet example
    console.log(`Profile identifier created: ${JSON.stringify(profileIdentifier)}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
