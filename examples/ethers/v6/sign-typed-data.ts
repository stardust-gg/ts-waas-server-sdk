import dotenv from 'dotenv';
dotenv.config();

import { TypedDataDomain, TypedDataField, getDefaultProvider } from 'ethers_v6';
import { ethers } from 'ethers_v6';
import { StardustCustodialSDK, StardustWallet } from '../../../src';

// Setup constants
const STARDUST_API_KEY = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;

// Typed Data Domain and Types
const domain: TypedDataDomain = {
  name: 'testing',
  version: '1',
  verifyingContract: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
};

const types: Record<string, TypedDataField[]> = {
  Order: [
    { name: 'buyer', type: 'address' },
    { name: 'seller', type: 'address' },
    { name: 'price', type: 'uint256' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
};

const value: Record<string, any> = {
  buyer: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
  seller: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
  price: '2',
  tokenId: '2',
  nonce: '3',
};

// Main function
async function main() {
  try {
    // Initialize Provider
    const provider = getDefaultProvider('mainnet');

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(STARDUST_API_KEY);

    // Get Wallet
    const wallet: StardustWallet = await sdk.getWallet(STARDUST_WALLET_ID);

    // Get V6 Signer
    const signer = wallet.ethers.v6.getSigner(provider);

    // Sign the typed data - natively in ethers v6
    const sig = await signer.signTypedData(domain, types, value);

    // Verify the typed data and get the recovered address
    const recoveredAddress = ethers.verifyTypedData(domain, types, value, sig);

    // Log results
    console.log(`Signature: ${sig}`);
    console.log(`Ethereum Address: ${await signer.getAddress()}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
