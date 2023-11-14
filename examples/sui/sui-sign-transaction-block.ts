import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import StardustCustodialSdk from '../../src/stardust/StardustCustodialSDK';
import { TransactionBlock } from '@mysten/sui.js/transactions';

import dotenv from 'dotenv';
dotenv.config();

type SuiNetwork = 'localnet' | 'devnet' | 'testnet' | 'mainnet';
const network: SuiNetwork = 'localnet';

const main = async () => {
  // Establish connection to the SUI network
  const client = new SuiClient({ url: getFullnodeUrl(network) });

  // Setup constants
  const VAULT_API_KEY = process.env.DEV_SYSTEM_VAULT_API_KEY!;
  const VAULT_WALLET_ID = process.env.DEV_SYSTEM_VAULT_WALLET_ID!;

  // Create a StardustCustodialSdk instance
  const stardust = new StardustCustodialSdk(VAULT_API_KEY);

  // grab relevant wallet
  const wallet = await stardust.getWallet(VAULT_WALLET_ID);

  // Get the sui address of the wallet - sui specific
  const address = await wallet.sui.address();

  // [optional] Request funds from the faucet to perform a tx
  // await requestSuiFromFaucetV0({
  //   host: getFaucetHost(network),
  //   recipient: address,
  // });

  // built tx for sui - application specific
  const tx = new TransactionBlock();
  const [coin] = tx.splitCoins(tx.gas, [1000]);
  tx.transferObjects([coin], address);
  tx.setSender(address);
  const builtTx: Uint8Array = await tx.build({ client });

  // sign a transaction block - most common
  const sig = await wallet.sui.signTransactionBlock(builtTx);

  // lets now send the tx to the network
  const sent_tx = await client.executeTransactionBlock({
    transactionBlock: builtTx,
    signature: sig,
  });

  console.log(sent_tx);
};

main();

// curl --location --request POST 'http://127.0.0.1:9123/gas' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "FixedAmountRequest": {
//         "recipient": "0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866"
//     }
// }'
