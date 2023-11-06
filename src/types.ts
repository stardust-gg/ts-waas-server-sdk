import { Bytes } from '@ethersproject/bytes';
import EthersSigner from './signers/EthersSigner';

type EthersType = {
  ethers: EthersSigner;
};

export type Signers = EthersType;
export type ChainType = 'EVM' | 'SUI' | 'evm' | 'sui';
export interface ApiRequestPayload {
  walletId: string; // uuid: example 'b8d0b9e0-5d8c-11eb-ae93-0242ac130002'
  chainType: ChainType; // only support 'EVM' for now
  chainId?: string; // chainId of the network
}

export interface SignRequestPayload extends ApiRequestPayload {
  message: string | Bytes;
}
