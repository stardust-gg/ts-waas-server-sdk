import { Config, ImmutableX, RegisterUserRequest, RegisterUserRequest, UsersApiRegisterUserRequest, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';

import { ethers } from 'ethers';

import { StardustCustodialSDK, StardustWallet } from '../src';
import { createStarkSigner } from '@imtbl/core-sdk';
// allow usage of env
import dotenv from 'dotenv';
dotenv.config();

const apiKey = String(process.env.DEV_SYSTEM_VAULT_API_KEY);
const walletId = String(process.env.DEV_SYSTEM_VAULT_WALLET_ID);
const rpcUrl = 'https://eth.public-rpc.com';

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const main = async () => {
  console.log(apiKey, walletId);
  const sdk = new StardustCustodialSDK(apiKey);
  const wallet: StardustWallet = await sdk.getWallet(walletId);
  const signer = wallet.signers.ethers.connect(provider);

  // Get the legacy Stark private key
  const starkPrivateKey = await generateLegacyStarkPrivateKey(signer);
  console.log(`starkprivateKey`, starkPrivateKey);

  // successfully generate a stark private key for use on imx however you would like:
  const config = Config.SANDBOX; // Or PRODUCTION
  const client = new ImmutableX(config);

  const imxSigner = createStarkSigner(starkPrivateKey);

  const imxAddress = imxSigner.getAddress();

  const registrationParams: UsersApiRegisterUserRequest = {
    registerUserRequest: RegisterUserRequest= {
    'email'?: string;
    'eth_signature': string;
    'ether_key': string;
    'stark_key': string;
    'stark_signature': string;
    };
  }
  client.usersApi.registerUser(imxAddress, imxSigner);
};

main();
