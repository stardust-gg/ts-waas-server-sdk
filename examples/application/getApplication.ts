import dotenv from 'dotenv';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;

async function main() {
  try {
    const sdk = new StardustCustodialSDK(apiKey);
    const application = await sdk.getApplication();
    console.log(JSON.stringify(application));
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
