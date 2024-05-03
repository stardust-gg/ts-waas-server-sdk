/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import {
  Account,
  AccountAuthenticatorEd25519,
  Aptos,
  AptosConfig,
  Ed25519PublicKey,
  Ed25519Signature,
  Network,
  generateSigningMessage,
} from '@aptos-labs/ts-sdk';

import dotenv from 'dotenv';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

// Default to devnet, but allow for overriding
const APTOS_NETWORK: Network = Network.DEVNET;

const main = async () => {
  // Initialize Stardust SDK
  const sdk = new StardustCustodialSDK(apiKey);

  // get the stardust profile/wallet/address for a player
  const profile = await sdk.getProfile(profileId);
  const { wallet } = profile;
  const stardustAddress = await wallet.aptos.getAddress();
  console.log('stardust address', stardustAddress);

  // Setup the aptos client
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);

  // generate an account for sending
  const bob = Account.generate();

  // Get funds for your account
  console.log('Funding stardust account');
  await aptos.faucet.fundAccount({
    accountAddress: stardustAddress,
    amount: 100_000_000,
  });

  // Create a transaction - transfer from stardustWallet to arbitrary bob wallet
  const transaction = await aptos.transaction.build.simple({
    sender: stardustAddress,
    data: {
      function: '0x1::coin::transfer',
      typeArguments: ['0x1::aptos_coin::AptosCoin'],
      functionArguments: [bob.accountAddress, 100],
    },
  });

  const toSign = generateSigningMessage(transaction);
  console.log('encoded transaction to sign', toSign);

  const signature = await wallet.aptos.signRaw(toSign);
  console.log('raw signature', signature);

  const publicKey = await wallet.aptos.getPublicKey();
  console.log('public key', publicKey);

  // Create an authenticator object for the transaction -- aptos only supported method for sending in their ts-sdk
  const senderAuthenticator = new AccountAuthenticatorEd25519(
    new Ed25519PublicKey(publicKey),
    new Ed25519Signature(signature)
  );

  const committedTransaction = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator,
  });
  console.log('committed', committedTransaction);
};

main();
