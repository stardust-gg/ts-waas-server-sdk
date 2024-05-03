import dotenv from 'dotenv';
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';
import { ethers } from 'ethers_v6';

dotenv.config();

// Configuration
const apiKey = process.env.PROD_SYSTEM_STARDUST_API_KEY!;
const profileId = process.env.PROD_SYSTEM_STARDUST_PROFILE_ID!;

async function main() {
  try {
    // Initialize Stardust SDK
    const sdk = new StardustCustodialSDK(apiKey);

    const profile = await sdk.getProfile(profileId);

    // send 0.1 eth to 0 address
    const rpcToTest = 'https://build.onbeam.com/rpc/testnet';
    const provider = new ethers.JsonRpcProvider(rpcToTest);
    const signer = await profile.wallets![0].ethers.v6.getSigner(provider);

    const tx = await signer.sendTransaction({
      to: `0x${'0'.repeat(40)}`,
      value: ethers.parseEther('0.1'),
    });

    console.log(tx);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
