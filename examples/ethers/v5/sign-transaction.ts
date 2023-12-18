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

    // Create Transaction
    const transaction = {
      to: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
      value: ethers.utils.parseEther('0.01'),
    };

    // Sign Transaction
    const signedTx = await signer.signTransaction(transaction);

    // Parse back into tx object
    const tx = ethers.utils.parseTransaction(signedTx);

    // Create raw tx object
    const rawTx = {
      ...transaction,
      nonce: tx.nonce,
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
      data: tx.data,
      chainId: tx.chainId,
    };

    // Calculate raw tx hash
    const rawTxHash = ethers.utils.keccak256(ethers.utils.serializeTransaction(rawTx));

    // Recover signer address from raw tx hash and signature
    const recoveredAddress = ethers.utils.recoverAddress(rawTxHash, {
      r: tx.r!,
      s: tx.s!,
      v: tx.v!,
    });

    // Log results
    console.log(`Signed transaction: ${JSON.stringify(signedTx, null, 2)}`);
    console.log(`Signer Address: ${ethAddress}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
