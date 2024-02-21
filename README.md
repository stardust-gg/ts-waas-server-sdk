# Stardust Custodial SDK

<!--
![banner]()
![badge]()
![badge]()
-->

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Table of Contents

- [Introduction](#introduction)
- [Changelog](#changelog)
  - [Features](#features)
  - [Bug Fixes](#fixes)
  - [Breaking Changes](#breaking)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Common Usage Patterns](#common-usage-patterns)
  - [Ethers V5](#ethers-V5)
  - [Ethers V6](#ethers-V6)
  - [IMX](#imx)
  - [EVM](#evm)
  - [SUI](#sui)
- [Contributing](#contributing)
- [License](#license)
- [Contact and Support](#contact-and-support)

## Introduction

**Stardust-Custodial-SDK** is a server side TypeScript-based SDK specifically crafted to enable seamless integration with Stardust custodial Wallets as a Service (WaaS). This SDK is designed for developers seeking to incorporate advanced wallet management features into their TypeScript applications with minimal effort - whether they're building a new project or enhancing an existing one.

## Changelog

### Latest Version: 2.2.0 [02/22/2023]

#### Features

- Adds profiles and profile identifier management to the sdk
  - sdk.getProfile(profileId) has been added
  - sdk.createProfile(applicationId) has been added
  - JWT generation for use client side with profile/wallet api
- Wallets are now accessible through profiles
  - profile.wallet
- Profiles are now accessible through the legacy wallet object
  - wallet.getProfile()

Releases can be found [here](https://github.com/stardust-gg/stardust-custodial-sdk/releases)

For a detailed version history, see the [full changelog](https://docs-waas.stardust.gg/change-log/v2).

## Getting started

#### Prerequisites

This SDK is intended for use with TypeScript. Familiarity with TypeScript and modern JavaScript development practices using NodeJs is recommended.

You will need to create an application and grab your api key @ waas.stardust.gg

#### Install

```
npm i @stardust-gg/stardust-custodial-sdk
```

#### Usage

```ts
import { StardustCustodialSDK } from '@stardust-gg/stardust-custodial-sdk';

const myApiKey = '<your-api-key-here>';

// connect to the api
const sdk = new StardustCustodialSDK(myApiKey);\
```

##### Creating a profile

```ts
const profile = await sdk.createProfile(applicationId);
const profileIdentifier = profile.id;
```

> **Note**: Store these profile identifiers, they are unique to your players/users and are how you will manage them.

##### Generate Client JWTs for client side operations

```ts
const duration = 600; // 10 mins
const clientJWT = await sdk.generateProfileJWT(profileId, duration);
```

> **Note**: These JWTs will allow operation over the profile, and therefore have standardized ttls that are configurable on generation up to 24 hours

##### Getting a Wallet

```ts
const profileId = <your-saved-profile-id>
const profile = await sdk.getProfile(walletId);
const { wallet } = profile
```

## Common Usage

### Examples

All common examples in their full form can be found under [examples](./examples/)

If you are cloning the repo and wish to run the examples directly use `yarn run-example <path-to-example>`

Like so:
`yarn run-example examples/sui/sui-sign-personal-message`

### Ethers V5

```ts
const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(<your-provider-url>)
const ethersV5Signer = await wallet.ethers.v5.getSigner().connect(provider)
```

Reference [Ethers v5](https://docs.ethers.org/v5/) documentation for usage of this signer.

### Ethers V6

```ts
const provider: JsonRpcProvider = new ethers.JsonRpcProvider(<your-provider-url>)
const ethersV6Signer = await wallet.ethers.v6.getSigner(provider)
```

Reference [Ethers v6](https://docs.ethers.org/v6/) documentation for usage of this signer.

### EVM

```ts
const userEVMAddress = await wallet.evm.getAddress();
const userEVMPublicKey = await wallet.evm.getPublicKey();
const rawSignedDigest = await wallet.evm.signRaw('0x010203');
const eip191signedMessage = await wallet.evm.signMessage('Hello World!');
```

### IMX

```ts
const starkSigner = await wallet.imx.getStarkSigner();
```

Reference [IMX-Core-SDK](https://github.com/immutable/imx-core-sdk/tree/main/examples) documentation for usage of StarkSigner

### SUI

```ts
const suiStardustSigner = await wallet.sui;
const builtTx: Uint8Array = <your-tx-object>;
const signedTransactionBlock = await wallet1.sui.signTransactionBlock(builtTx);
```

Reference [sui typescript sdk](https://github.com/MystenLabs/sui/blob/main/sdk/typescript/README.md) documentation for usage of Sui.

Additionally, you can reference [examples](./examples/sui/) of use cases for Sui.

## Contributing

Feel free to open pull requests to propose changes or additions.

## License

[Apache-2.0](./LICENSE.md)

This project uses portions of ethers.js, developed by Richard Moore (@ricmoo), under the [MIT License](./LICENSE.ETHERS.JS.MD).

## Contact and Support

For support or feedback, please reach out to:

- support@stardust.gg
