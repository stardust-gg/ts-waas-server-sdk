import dotenv from 'dotenv';
dotenv.config();

import { ImmutableX, StarkSigner } from '@imtbl/core-sdk';
import { ethers } from 'ethers';
import { StardustCustodialSDK, StardustWallet } from '../../src';

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const rpcUrl = process.env.SANDBOX_IMX_RPC_URL!; // SANDBOX: must match network for imx config

// Main function
async function main() {
  try {
    // Initialize provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

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
