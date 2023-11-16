import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../../../src';

// allow usage of env
import dotenv from 'dotenv';
import { UnsignedTransaction, serialize } from '@ethersproject/transactions';
import { resolveProperties } from '@ethersproject/properties';
import { serializeTransaction } from 'ethers/lib/utils';
dotenv.config();

const apiKey = String(process.env.DEV_SYSTEM_STARDUST_API_KEY);
const walletId = String(process.env.DEV_SYSTEM_STARDUST_WALLET_ID);
// imx rpc
const rpcUrl = 'https://eth.public-rpc.com';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const main = async (apiKey: string, walletId: string, provider: ethers.providers.Provider) => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);

  const signer = wallet.ethers.v5.getSigner().connect(provider);

  const ethAddress = await signer.getAddress();

  const transaction = {
    to: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
    value: ethers.utils.parseEther('0.01'),
  };

  const signedTx = await signer.signTransaction(transaction);
  const tx = ethers.utils.parseTransaction(signedTx);
  const rawTx = {
    ...transaction,
    nonce: tx.nonce,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    data: tx.data,
    chainId: tx.chainId,
  };

  const rawTxHash = ethers.utils.keccak256(ethers.utils.serializeTransaction(rawTx));
  const recoveredAddress = ethers.utils.recoverAddress(rawTxHash, {
    r: tx.r!,
    s: tx.s!,
    v: tx.v!,
  });

  return {
    signedTx,
    ethAddress,
    recoveredAddress,
  };
};

main(apiKey, walletId, provider);

export default main;
