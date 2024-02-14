import dotenv from 'dotenv';
import { StardustCustodialSDK } from '../../dist/index';

dotenv.config();

// Configuration
const apiKey = process.env.DEV_SYSTEM_STARDUST_API_KEY!;

async function main() {
  try {
    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get you application id
    const application = await sdk.getApplication();

    // Create a profile - naming is optional
    const profile = await sdk.createProfile(application.id, 'My Profile Name'); // can save profile.id for later access
    console.log(`Profile: ${JSON.stringify(profile)}`);

    // Get grab wallet object off of the profile for usage in signing/sending/etc
    const { wallet } = profile;
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
