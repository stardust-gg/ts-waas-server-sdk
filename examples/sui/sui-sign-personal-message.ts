import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import StardustCustodialSdk from '../../src/stardust/StardustCustodialSDK';
import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';

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

  // message to sign - application specific
  const encoder = new TextEncoder();
  const msg = 'hello world';
  const encodedMsg = encoder.encode(msg);

  // sign the personal message
  const sig = await wallet.sui.signPersonalMessage(encodedMsg);

  const hexPubKey = await wallet.sui.publicKey();
  const pubKeyBytes = Buffer.from(`${hexPubKey.replace(/^0x/, '')}`, 'hex'); // for usage with sui sdk
  const pubKey = new Ed25519PublicKey(pubKeyBytes);
  console.log(`verified offchain signing: ${await pubKey.verifyPersonalMessage(encodedMsg, sig)}`);
};

main();

// curl --location --request POST 'http://127.0.0.1:9123/gas' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "FixedAmountRequest": {
//         "recipient": "0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866"
//     }
// }'
