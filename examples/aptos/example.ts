/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */

import {
  Account,
  AccountAddress,
  AccountAuthenticatorEd25519,
  Aptos,
  AptosConfig,
  Ed25519Account,
  Ed25519PrivateKey,
  Ed25519PublicKey,
  Hex,
  Network,
  NetworkToNetworkName,
  Serializer,
  generateSigningMessage,
} from '@aptos-labs/ts-sdk';
import { createHash, sign } from 'crypto';

import { sha3_256 } from '@noble/hashes/sha3';
import { uint8ArrayToHexString } from 'src/utils';

// TODO: There currently isn't a way to use the APTOS_COIN in the COIN_STORE due to a regex
const APTOS_COIN = '0x1::aptos_coin::AptosCoin';
const COIN_STORE = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';
const ALICE_INITIAL_BALANCE = 100_000_000;
const BOB_INITIAL_BALANCE = 100;
const TRANSFER_AMOUNT = 100;

// Default to devnet, but allow for overriding
const APTOS_NETWORK: Network = Network.DEVNET;

/**
 * Prints the balance of an account
 * @param aptos
 * @param name
 * @param address
 * @returns {Promise<*>}
 *
 */
const balance = async (aptos: Aptos, name: string, address: AccountAddress) => {
  type Coin = { coin: { value: string } };
  const resource = await aptos.getAccountResource<Coin>({
    accountAddress: address,
    resourceType: COIN_STORE,
  });
  const amount = Number(resource.coin.value);

  console.log(`${name}'s balance is: ${amount}`);
  return amount;
};

const example = async () => {
  console.log(
    'This example will create two accounts (Alice and Bob), fund them, and transfer between them.'
  );

  // Setup the client
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);

  // Create two accounts
  const privKey = new Uint8Array([
    2, 14, 191, 141, 138, 160, 18, 29, 235, 72, 21, 24, 214, 215, 40, 14, 112, 169, 121, 65, 53,
    184, 44, 81, 87, 97, 168, 16, 49, 229, 135, 61,
  ]);
  //   const publicKey = new Uint8Array([
  //     118, 97, 213, 181, 43, 55, 173, 112, 47, 53, 165, 184, 244, 120, 162, 104, 120, 169, 163, 115,
  //     187, 189, 155, 136, 145, 72, 101, 22, 68, 216, 91, 112,
  //   ]);
  const alice = new Ed25519Account({
    privateKey: new Ed25519PrivateKey(privKey),
  });

  const bob = Account.generate();

  console.log('=== Addresses ===\n');
  console.log(`Alice's address is: ${alice.accountAddress}`);
  console.log(`Bob's address is: ${bob.accountAddress}`);

  //   Fund the accounts
  console.log('\n=== Funding accounts ===\n');

  const aliceFundTxn = await aptos.faucet.fundAccount({
    accountAddress: alice.accountAddress,
    amount: ALICE_INITIAL_BALANCE,
  });
  console.log("Alice's fund transaction: ", aliceFundTxn);

  const bobFundTxn = await aptos.faucet.fundAccount({
    accountAddress: bob.accountAddress,
    amount: BOB_INITIAL_BALANCE,
  });
  console.log("Bob's fund transaction: ", bobFundTxn);

  //   // Show the balances
  console.log('\n=== Balances ===\n');
  const aliceBalance = await balance(aptos, 'Alice', alice.accountAddress);
  const bobBalance = await balance(aptos, 'Bob', bob.accountAddress);

  if (aliceBalance < ALICE_INITIAL_BALANCE) throw new Error("Alice's balance is incorrect");
  if (bobBalance < BOB_INITIAL_BALANCE) throw new Error("Bob's balance is incorrect");

  //   Transfer between users
  const transaction = await aptos.transaction.build.simple({
    sender: alice.accountAddress,
    data: {
      function: '0x1::coin::transfer',
      typeArguments: ['0x1::aptos_coin::AptosCoin'],
      functionArguments: [bob.accountAddress, 100],
    },
  });
  console.log('transaction', transaction);
  const toSign = generateSigningMessage(transaction);
  const signature = alice.sign(toSign);
  console.log('alice signed:', toSign.toString());
  const senderAuthenticator = new AccountAuthenticatorEd25519(alice.publicKey, signature);
  //   0xf5344f963ace7a7592a18a18be490b491110deb303828f348a5b05e81fc90410e01ce942c8313543d58f450669fa9e9ea60bda0f0af2d02bc4ec00ff8cdd0b0c
  const committedTransaction = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator,
  });
  console.log('committed', committedTransaction);
};

example();
