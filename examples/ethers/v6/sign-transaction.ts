import dotenv from 'dotenv';
dotenv.config();

import { Transaction, TransactionLike, ethers, recoverAddress } from 'ethers_v6';
import { StardustCustodialSDK, StardustWallet } from '../../../src';
import { sign } from 'crypto';
import { decode } from 'punycode';

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const rpcUrl = process.env.RPC_URL!;

async function main() {
  try {
    // Initialize Provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    // Get Wallet
    const wallet: StardustWallet = await sdk.getWallet(walletId);

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
    const unsignedSerialized = builtTx.unsignedSerialized;

    const recoveredAddress = recoverAddress(
      ethers.keccak256(unsignedSerialized),
      builtTx.signature!
    );

    // Log results
    console.log(`Serialized tx ${JSON.stringify(signedTx, null, 2)}`);
    console.log(`Signer Address: ${ethAddress}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
