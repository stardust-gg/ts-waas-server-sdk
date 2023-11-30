import dotenv from 'dotenv';

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { requestSuiFromFaucetV0, getFaucetHost } from '@mysten/sui.js/faucet';
import { verifyTransactionBlock } from '@mysten/sui.js/verify';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

type SuiNetwork = 'localnet' | 'devnet' | 'testnet';
const network: SuiNetwork = 'localnet';

// Setup constants
const STARDUST_API_KEY = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const STARDUST_WALLET_ID_2 = process.env.PROD_SYSTEM_STARDUST_WALLET_ID_2!;

// This is currently an example set up to use a locally running validator test network
// https://docs.sui.io/guides/developer/getting-started/local-network
async function main() {
  try {
    // Establish connection to the SUI network
    const client = new SuiClient({ url: getFullnodeUrl(network) });

    // Create a StardustCustodialSdk instance
    const stardust = new StardustCustodialSDK(STARDUST_API_KEY);

    // Grab relevant wallets
    const wallet1 = await stardust.getWallet(STARDUST_WALLET_ID);
    const wallet2 = await stardust.getWallet(STARDUST_WALLET_ID_2);

    // Get the SUI addresses of the wallets (SUI specific)
    const address1 = await wallet1.sui.getAddress();
    const address2 = await wallet2.sui.getAddress();

    // [optional] Request funds from the faucet to perform a transaction
    await requestSuiFromFaucetV0({
      host: getFaucetHost(network),
      recipient: address1,
    });

    // Build a transaction for SUI - application specific
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [1000]);
    tx.transferObjects([coin], address2);
    tx.setSender(address1);
    const builtTx: Uint8Array = await tx.build({ client });

    // Sign a transaction block - most common
    const sig = await wallet1.sui.signTransactionBlock(builtTx);

    // Recover the signature
    const recoveredAddress = (await verifyTransactionBlock(builtTx, sig)).toSuiAddress();

    // Log the results
    console.log(`Signature: ${sig}`);
    console.log(`Address 1: ${address1}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

main();
