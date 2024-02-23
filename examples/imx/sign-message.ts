import dotenv from 'dotenv';

import { StarkSigner } from '@imtbl/core-sdk';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

// Main function
async function main() {
  try {
    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get wallet
    const profile = await sdk.getProfile(profileId);
    const { wallet } = profile;

    // Obtain L2 Imx Stark Signer - deterministic from L1 signer
    const imxSigner: StarkSigner = await wallet.imx.getStarkSigner();

    // Get signature for usage
    const sig = await imxSigner.signMessage('0x1234');

    console.log('StarkSigner Public Key ', await imxSigner.getAddress());
    console.log('Signature: ', sig);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

main();
