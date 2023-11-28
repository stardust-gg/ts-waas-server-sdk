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
  - [Breaking Changes](#breaking)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Common Usage Patterns](#common-usage-patterns)
  - [Ethers-V5](#ethers-V5)
  - [Ethers-V6](#ethers-V6)
  - [IMX](#imx)
  - [EVM](#evm)
  - [SUI](#sui)
- [Contributing](#contributing)
- [License](#license)
- [Contact and Support](#contact-and-support)

## Introduction

**Stardust-Custodial-SDK** is a TypeScript-based SDK specifically crafted to enable seamless integration with the Stardust custodial wallet management system. This SDK is designed for TypeScript developers looking to incorporate advanced wallet management features into their applications with minimal effort - whether you're building a new project or enhancing an existing one.

## Changelog

Stardust-Custodial-SDK V2 introduces several key enhancements to enhance your blockchain development experience:

#### Features

- **IMX Support**: Support for generating deterministic IMX Signers.
- **SUI Support**: Compatibility added with the SUI blockchain. Message Signing and Transaction Block Signing.
- **Ethers v6 Support**: Updated for compatibility with ethers.js library version 6.
- **EIP 191 Message Signing**: Implementation of EIP 191 standards for EVM message signing.

#### Breaking

- **Breaking Change**: Changes in accessing ethers v5 - refer to [Common Usage Patterns](#common-usage-patterns).

## Getting started

#### Prerequisites

This SDK is intended for use with TypeScript. Familiarity with TypeScript and modern JavaScript development practices is using NodeJs is recommended.

You will need to create an application and grab your api key @ waas.stardust.gg

#### Install

```
npm i @stardust-gg/stardust-custodial-sdk
```

#### Usage

```python
import os;

os.thing()

```

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

\*\*\*Note: you should be storing these wallet Identifiers as they are unique to your players/users and are how you will manage them

## Common Usage Patterns

#### Ethers-V5

```ts
const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(<your-provider-url>)
const ethersV5Signer = await wallet.ethers.v5.getSigner().connect(provider)
```

Reference Ethers v5 documentation for usage of this signer.

#### EthersV6

```ts
const provider: JsonRpcProvider = new ethers.JsonRpcProvider(<your-provider-url>)
const ethersV6Signer = await wallet.ethers.v5.getSigner(provider)
```

Reference Ethers v6 documentation for usage of this signer.

#### EVM

```ts
const evmStardustSigner = await wallet.evm;
```

#### IMX

#### SUI

## Contributing

Feel free to open pull requests to propose changes or additions.

## License

[Apache-2.0](./LICENSE.md)

## Contact and Support

For support or feedback, please reach out to:

- blockchain@stardust.gg
- brandon.null@stardust.gg
