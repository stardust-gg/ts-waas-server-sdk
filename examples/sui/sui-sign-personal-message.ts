import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import StardustCustodialSdk from '../../src/stardust/StardustCustodialSDK';
import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';

import dotenv from 'dotenv';
import { verifyPersonalMessage } from '@mysten/sui.js/verify';
dotenv.config();

type SuiNetwork = 'localnet' | 'devnet' | 'testnet' | 'mainnet';
const network: SuiNetwork = 'localnet';

// Setup constants
const STARDUST_API_KEY = process.env.DEV_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.DEV_SYSTEM_STARDUST_WALLET_ID!;

const main = async (apiKey: string, walletId: string) => {
  // Create a StardustCustodialSdk instance
  const stardust = new StardustCustodialSdk(STARDUST_API_KEY);

  // grab relevant wallet
  const wallet = await stardust.getWallet(STARDUST_WALLET_ID);

  // Get the sui address of the wallet - sui specific
  const address = await wallet.sui.getAddress();

  // message to sign - application specific
  const encoder = new TextEncoder();
  const msg = 'hello world';
  const encodedMsg = encoder.encode(msg);

  // sign the personal message
  const sig = await wallet.sui.signPersonalMessage(encodedMsg);

  const hexPubKey = await wallet.sui.getPublicKey();
  const pubKeyBytes = Buffer.from(`${hexPubKey.replace(/^0x/, '')}`, 'hex'); // for usage with sui sdk
  const pubKey = new Ed25519PublicKey(pubKeyBytes);

  const recoveredAddress = await verifyPersonalMessage(encodedMsg, sig);

  return {
    sig,
    address,
    recoveredAddress: recoveredAddress.toSuiAddress(),
  };
};

main(STARDUST_API_KEY, STARDUST_WALLET_ID);

export default main;

// curl --location --request POST 'http://127.0.0.1:9123/gas' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "FixedAmountRequest": {
//         "recipient": "0x6be1c919bb05ba60d30731a1cbcb1d0f5943e6ef2a200563b50f104f9efae866"
//     }
// }'
