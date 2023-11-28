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

**Stardust-Custodial-SDK** is a TypeScript-based SDK specifically crafted to enable seamless integration with the Stardust custodial Wallets as a service (WaaS). This SDK is designed for TypeScript developers looking to incorporate advanced wallet management features into their applications with minimal effort - whether you're building a new project or enhancing an existing one.

## Changelog

### Latest Version: 2.0.0 [11/30/2023]

#### Features

- **IMX Support**: Support for generating deterministic IMX Signers.
- **SUI Support**: Compatibility added with the SUI blockchain. Message Signing and Transaction Block Signing.
- **Ethers v6 Support**: Updated for compatibility with ethers.js library version 6.
- **EIP 191 Message Signing**: Implementation of EIP 191 standards for EVM message signing.

#### Fixes

- **UTF8 Signing/Encoding**: Fixed a bug where UTF8 string with valid unicode characters wouldn't parse correctly

#### Breaking Changes

- Changes in accessing ethers v5 - refer to [Common Usage](#common-usage) patterns.

For more detailed version history, see the [full changelog](./changelog.md).

## Getting started

#### Prerequisites

This SDK is intended for use with TypeScript. Familiarity with TypeScript and modern JavaScript development practices is using NodeJs is recommended.

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

// creating a wallet
const wallet = await sdk.createWallet();

// getting wallet identifier
const walletIdentifier = wallet.id;
```

> **Note**: You should be storing these wallet identifiers as they are unique to your players/users and are how you will manage them.

## Common Usage

### Ethers V5

```ts
const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(<your-provider-url>)
const ethersV5Signer = await wallet.ethers.v5.getSigner().connect(provider)
```

Reference [Ethers v5](https://docs.ethers.org/v5/) documentation for usage of this signer.

### Ethers V6

```ts
const provider: JsonRpcProvider = new ethers.JsonRpcProvider(<your-provider-url>)
const ethersV6Signer = await wallet.ethers.v5.getSigner(provider)
```

Reference [Ethers v6](https://docs.ethers.org/v6/) documentation for usage of this signer.

### EVM

```ts
const userEVMAddress = await wallet.evm.getAddress();
const userEVMPublicKey = await wallet.evm.getPublicKey();
const rawSignedDigest = await wallet.evm.signRaw('0x010203');
const eip191signedMessage = await wallet.evm.signMessage('hello world');
```

### IMX

```ts
const starkSigner = await wallet.imx.getStarkSigner();
```

Reference [IMX-Core-SDK](https://github.com/immutable/imx-core-sdk/tree/main/examples) documentation on usage with StarkSigner

### SUI

```ts
const suiStardustSigner = await wallet.sui;
const builtTx: Uint8Array = <your-tx-object>;
const signedTransactionBlock = await wallet1.sui.signTransactionBlock(builtTx);
```

## Contributing

Feel free to open pull requests to propose changes or additions.

## License

[Apache-2.0](./LICENSE.md)

## Contact and Support

For support or feedback, please reach out to:

- blockchain@stardust.gg
- brandon.null@stardust.gg
