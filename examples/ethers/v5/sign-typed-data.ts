/* eslint-disable prettier/prettier */

import { joinSignature } from '@ethersproject/bytes';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { TypedDataDomain, TypedDataField } from 'ethers/lib/ethers';
import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../../../src';
import dotenv from 'dotenv';
dotenv.config();

// Setup constants
const STARDUST_API_KEY = process.env.DEV_SYSTEM_STARDUST_API_KEY!;
const STARDUST_WALLET_ID = process.env.DEV_SYSTEM_STARDUST_WALLET_ID!;
const RPC_RUL = 'https://eth.public-rpc.com';

const provider = new ethers.providers.JsonRpcProvider(RPC_RUL);

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

const recoverSigner = (order: any, signature: any) => {
  const typedDataHash = ethers.utils.keccak256(_TypedDataEncoder.encode(domain, types, order));
  return ethers.utils.recoverAddress(typedDataHash, signature);
};

const main = async (apiKey: string, walletId: string, provider: ethers.providers.Provider) => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);
  const signer = wallet.ethers.v5.getSigner().connect(provider);

  const value: Record<string, any> = {
    buyer: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
    seller: '0x355172E1AA17117DfCFDD2AcB4b0BFDA8308Cbc9',
    price: '2',
    tokenId: '2',
    nonce: '3',
  };

  const populated = await _TypedDataEncoder.resolveNames(
    domain,
    types,
    value,
    async (name: string) => {
      return (await provider.resolveName(name)) ?? 'null';
    }
  );

  const sig = joinSignature(
    await signer.signRaw(_TypedDataEncoder.encode(populated.domain, types, populated.value))
  );

  const recoveredAddress = recoverSigner(value, sig);

  return { sig, ethAddress: await signer.getAddress(), recoveredAddress };
};

main(STARDUST_API_KEY, STARDUST_WALLET_ID, provider);

export default main;
