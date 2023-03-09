# Stardust Custodial SDK

<!--
![banner]()
![badge]()
![badge]()
-->

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Background

This sdk is intended for use with the Stardust Custodial Wallet API, and its main purpose is to easily allow its implementers to create Stardust custodial wallets. These wallet objects can be instantiated, and an EthersSigner (satisfying [Ethers.js](https://docs.ethers.org/v5/api/signer/#Signer)'s Signer requirements) can be accessed. More signers will be released in following updates.

The EthersSigner can be used in place of any existing Ethers signers. See the examples in the later sections.

## Install

```
npm i @stardust-gg/stardust-custodial-sdk
```

## Usage

The StardustCustodialSDK object is designed to be used with only 1 app. If your use case requires to have multiple apps, multiple StardustCustodialSDK's will need to be used.

### Creating your first app

```ts
import { StardustCustodialSDK, StardustApp } from '@stardust-gg/stardust-custodial-sdk';

// create your app object locally
const app: StardustApp = new StardustApp('app_name', 'email@address.xyz', 'optional_description');

// create a StardustApp instance in the Stardust API
await StardustCustodialSDK.Create(app);

// save the api key so you can access this app later
const apiKey = app.apiKey;
```

### Getting your app and creating wallet

```ts
import {
  StardustCustodialSDK,
  StardustApp,
  StardustWallet,
} from '@stardust-gg/stardust-custodial-sdk';

const STARDUST_API_KEY = 'your-api-key';
const sdk = new StardustCustodialSDK(STARDUST_API_KEY);
const wallet: StardustWallet = await sdk.createWallet();

// Make sure to save this walletId for later steps!
const walletId = wallet.id;
await clientWalletDB.save(walletId);
```

### Send some ETH from your StardustWallet to any other address using Ethers.js

```ts
import { ethers } from 'ethers';
import { StardustCustodialSDK, StardustApp, StardustWallet } from 'stardust-custodial-sdk';

const rpcUrl = 'https://your_rpc_providers.url';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const STARDUST_API_KEY = 'your-api-key';
const sdk = new StardustCustodialSDK(apiKey);

const WALLET_ID = 'your-wallet-id';
const wallet: StardustWallet = await sdk.getWallet(WALLET_ID);

const signer = wallet.signers.ethers.connect(provider);

// the below will get the chainId from the connected provider
const txn = {
  to: '0xaBcDef1234567890Abcdef1234567890Abcdef12', // to address
  value: ethers.utils.parseEther('1.0'), // ether value to send with transaction
};

// sign and send the transaction using the supplied provider
await signer.sendTransaction(txn);
```

## Contributing

PRs accepted.

## License

Apache-2.0
