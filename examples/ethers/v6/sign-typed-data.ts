/* eslint-disable prettier/prettier */

import { joinSignature } from '@ethersproject/bytes';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { TypedDataDomain, TypedDataField } from 'ethers_v6';
import { ethers } from 'ethers_v6';

import { StardustCustodialSDK, StardustWallet } from '../../../src';
import dotenv from 'dotenv';
dotenv.config();

// Setup constants
const STARDUST_API_KEY = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.PROD_SYSTEM_STARDUST_WALLET_ID!;
const RPC_RUL = 'https://eth.public-rpc.com';

const provider = new ethers.JsonRpcProvider(RPC_RUL);

const domain: TypedDataDomain = {
  name: 'testing',
  version: '1',
  verifyingContract: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
};

const types: Record<string, TypedDataField[]> = {
  Order: [
    { name: 'buyer', type: 'address' },
    { name: 'seller', type: 'address' },
    { name: 'price', type: 'uint256' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
};

const value: Record<string, any> = {
  buyer: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
  seller: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
  price: '2',
  tokenId: '2',
  nonce: '3',
};

const main = async (apiKey: string, walletId: string, provider: ethers.Provider) => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);
  const signer = wallet.ethers.v6.getSigner(provider);

  const sig = await signer.signTypedData(domain, types, value);

  const recoveredAddress = ethers.verifyTypedData(domain, types, value, sig);

  return { sig, ethAddress: await signer.getAddress(), recoveredAddress };
};

main(STARDUST_API_KEY, STARDUST_WALLET_ID, provider);

export default main;
