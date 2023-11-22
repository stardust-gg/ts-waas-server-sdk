import dotenv from 'dotenv';
dotenv.config();

import { joinSignature } from '@ethersproject/bytes';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { TypedDataDomain, TypedDataField } from 'ethers/lib/ethers';
import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../../../src';

// Setup constants
const STARDUST_API_KEY = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const RPC_RUL = process.env.RPC_URL!;

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

// Function to recover signer from typed data
const recoverSigner = (order: any, signature: any) => {
  // Calculate typed data hash
  const typedDataHash = ethers.utils.keccak256(_TypedDataEncoder.encode(domain, types, order));
  // Recover the signer's address from the signature
  return ethers.utils.recoverAddress(typedDataHash, signature);
};

// Main function
async function main() {
  try {
    // Initialize Provider
    const provider = new ethers.providers.JsonRpcProvider(RPC_RUL);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(STARDUST_API_KEY);

    // Get Wallet
    const wallet: StardustWallet = await sdk.getWallet(STARDUST_WALLET_ID);

    // Connect to Provider
    const signer = wallet.ethers.v5.getSigner().connect(provider);

    // Create value object for typed data
    const value: Record<string, any> = {
      buyer: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
      seller: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
      price: '2',
      tokenId: '2',
      nonce: '3',
    };

    // Resolve ENS names in typed data
    const populated = await _TypedDataEncoder.resolveNames(
      domain,
      types,
      value,
      async (name: string) => {
        return (await provider.resolveName(name)) ?? 'null';
      }
    );

    // Sign the typed data
    const sig = joinSignature(
      await signer.signRaw(_TypedDataEncoder.encode(populated.domain, types, populated.value))
    );

    // Recover the signer's address
    const recoveredAddress = recoverSigner(value, sig);

    // Log results
    console.log(`Signature: ${sig}`);
    console.log(`Ethereum Address: ${await signer.getAddress()}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
