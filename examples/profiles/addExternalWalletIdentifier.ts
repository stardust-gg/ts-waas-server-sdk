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

    const userInputAddress = '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E';

    const profileIdentifier = await profile.addEVMExternalWalletIdentifier(userInputAddress);

    // check out how to use wallets in the wallet example
    console.log(`Profile identifier created: ${JSON.stringify(profileIdentifier)}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
