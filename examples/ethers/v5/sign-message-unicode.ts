import dotenv from 'dotenv';

import { ethers } from 'ethers_v5';
import { StardustCustodialSDK, StardustWallet } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const rpcUrl = process.env.RPC_URL!;

async function main() {
  try {
    // Initialize Provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

    // Get V5 Signer
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // Get Ethereum Address
    const ethAddress = await signer.getAddress();

    // Sign a Message
    const message1 = `Only sign this request if you’ve initiated an action with Immutable X.`;
    const sig1 = await signer.signMessage(message1);

    // Verify the message and get the recovered address
    const recoveredAddress1 = ethers.utils.verifyMessage(message1, sig1);

    const message2 = `Only sign this request if you\u2019ve initiated an action with Immutable X.`;
    const sig2 = await signer.signMessage(message2);

    // Verify the message and get the recovered address
    const recoveredAddress2 = ethers.utils.verifyMessage(message2, sig2);

    // Output
    console.log(`Ethereum Address: ${ethAddress}`);
    console.log(`Signed Message: ${message1}`);
    console.log(`Signature: ${sig1}`);
    console.log(`Recovered Address: ${recoveredAddress1}`);
    console.log(`Signed Message (unicode char): ${message2}`);
    console.log(`Signature (unicode char): ${sig2}`);
    console.log(`Recovered Address (unicode char): ${recoveredAddress2}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
