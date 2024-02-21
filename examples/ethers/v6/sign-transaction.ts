import dotenv from 'dotenv';

import { Transaction, ethers, getDefaultProvider, recoverAddress } from 'ethers_v6';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

async function main() {
  try {
    // Initialize Provider
    const provider = getDefaultProvider('mainnet');

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const profile = await sdk.getProfile(profileId);
    const { wallet } = profile;

    // Get V6 Signer
    const signer = wallet.ethers.v6.getSigner(provider);

    // Get Ethereum Address
    const ethAddress = await signer.getAddress();

    // Create Transaction
    const transaction = {
      to: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
      value: ethers.parseEther('0.01'),
    };

    // Sign Transaction
    const signedTx = await signer.signTransaction(transaction);

    // Deserialize the signed tx
    const builtTx = Transaction.from(signedTx);
    const { unsignedSerialized } = builtTx;

    const recoveredAddress = recoverAddress(
      ethers.keccak256(unsignedSerialized),
      builtTx.signature!
    );

    // Log results
    console.log('Signed tx', builtTx.signature!.r + builtTx.signature!.s + builtTx.signature!.v);
    console.log(`Serialized tx ${JSON.stringify(signedTx, null, 2)}`);
    console.log(`Signer Address: ${ethAddress}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
