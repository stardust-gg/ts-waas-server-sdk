import dotenv from 'dotenv';
import axios from 'axios';
import { ethers } from 'ethers_v5';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const walletId = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;

async function main() {
  try {
    const rpcUrl = 'https://ethereum-sepolia-rpc.publicnode.com';
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Create Transaction -- application specific
    // https://ethereum.org/en/developers/docs/transactions/
    const eip1559transaction = {
      to: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9', // recipient address, contract or EOA
      value: ethers.utils.parseEther('0.01'), // amount to send
      nonce: 2, // manage this or interact with the rpc directly to get the next nonce
      maxFeePerGas: ethers.utils.parseUnits('10', 'gwei'), // based on the network you are interacting with
      maxPriorityFeePerGas: ethers.utils.parseUnits('10', 'gwei'), // tip based on the network you are interacting with
      gasLimit: 21000, // standard for basic transaction, if interacting with a contract you will need to estimate the gas
      data: '0x', // hex encoded data to interact with a contract https://ethereum.org/en/developers/docs/transactions/#the-data-field
      chainId: 11155111, // chainId of the network you are interacting with, this example uses sepolia
      type: 2, // 1559 transaction type
    };

    // encode the transaction, using some third party library
    // https://github.com/ethers-io/ethers.js/blob/v5.7.2/packages/transactions/src.ts/index.ts#L305
    const encodedTransaction = ethers.utils.serializeTransaction(eip1559transaction);
    console.log(encodedTransaction, 'encodedTransaction');

    // get the signature for the encoded serialized unsigned transaction given your walletId
    const payload = {
      walletId,
      chainType: 'evm',
      message: encodedTransaction,
    };

    const resp = await axios.post('https://custodial-wallet.stardust.gg/v1/sign/message', payload, {
      headers: { 'x-api-key': apiKey },
    });

    const { signature } = resp.data;

    // serialize the transaction with the signature
    // https://github.com/ethers-io/ethers.js/blob/v5.7.2/packages/transactions/src.ts/index.ts#L305
    const serializedSignedTx = ethers.utils.serializeTransaction(eip1559transaction, signature);

    // interact directly with rpc to send the transaction using `eth_sendRawTransaction`
    // https://github.com/ethers-io/ethers.js/blob/v5.7.2/packages/providers/src.ts/json-rpc-provider.ts#L212
    const sentTx = await rpcProvider.sendTransaction(serializedSignedTx);

    // Log results
    console.log(`Sent tx object ${JSON.stringify(sentTx)}`);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
