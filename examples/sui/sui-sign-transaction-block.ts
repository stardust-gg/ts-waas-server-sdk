import { PublicKey, SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import StardustCustodialSdk from '../../src/stardust/StardustCustodialSDK';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { requestSuiFromFaucetV0, getFaucetHost } from '@mysten/sui.js/faucet';
import { verifyTransactionBlock } from '@mysten/sui.js/verify';

import dotenv from 'dotenv';
import { Ed25519PublicKey } from '@mysten/sui.js/dist/cjs/keypairs/ed25519';
dotenv.config();

type SuiNetwork = 'localnet' | 'devnet' | 'testnet' | 'mainnet';
const network: SuiNetwork = 'localnet';

// Setup constants
const STARDUST_API_KEY = process.env.DEV_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.DEV_SYSTEM_STARDUST_WALLET_ID!;
const STARDUST_WALLET_ID_2 = process.env.DEV_SYSTEM_STARDUST_WALLET_ID_2!;

const main = async (apiKey: string, walletId1: string, walletId2: string) => {
  // Establish connection to the SUI network
  const client = new SuiClient({ url: getFullnodeUrl(network) });

  // Create a StardustCustodialSdk instance
  const stardust = new StardustCustodialSdk(apiKey);

  // grab relevant wallet
  const wallet1 = await stardust.getWallet(walletId1);
  const wallet2 = await stardust.getWallet(walletId2);

  // Get the sui address of the wallet - sui specific
  const address1 = await wallet1.sui.getAddress();
  const address2 = await wallet2.sui.getAddress();

  // [optional] Request funds from the faucet to perform a tx
  await requestSuiFromFaucetV0({
    host: getFaucetHost(network),
    recipient: address1,
  });

  // built tx for sui - application specific
  const tx = new TransactionBlock();
  const [coin] = tx.splitCoins(tx.gas, [1000]);
  tx.transferObjects([coin], address2);
  tx.setSender(address1);
  const builtTx: Uint8Array = await tx.build({ client });

  // sign a transaction block - most common
  const sig = await wallet1.sui.signTransactionBlock(builtTx);

  // recover signature
  const recoveredAddress = (await verifyTransactionBlock(builtTx, sig)).toSuiAddress();

  return {
    sig,
    address: address1,
    recoveredAddress: recoveredAddress,
  };

  // // lets now send the tx to the network
  // const sent_tx = await client.executeTransactionBlock({
  //   transactionBlock: builtTx,
  //   signature: sig,
  // });

  // console.log(`\n\nSent tx digest ${sent_tx.digest}\n\n`);
};

main(STARDUST_API_KEY, STARDUST_WALLET_ID, STARDUST_WALLET_ID_2);

export default main;
