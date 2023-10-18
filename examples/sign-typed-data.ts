/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */

import { joinSignature } from '@ethersproject/bytes';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { TypedDataDomain, TypedDataField } from 'ethers/lib/ethers';
import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../src';

const apiKey = '';
const walletId = '';

const rpcUrl = '';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const domain: TypedDataDomain = {
  name: 'testing',
  version: '1',
  chainId: 80001,
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

const main = async () => {
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);
  const signer = wallet.signers.ethers.connect(provider);

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
    await signer.signMessage(_TypedDataEncoder.encode(populated.domain, types, populated.value))
  );

  const recoveredAddress = recoverSigner(value, sig);

  console.log('sig recovers to', recoveredAddress); // Logs the address of the signer
};

main();
