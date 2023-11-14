import { Bytes } from '@ethersproject/bytes';

export type ChainType = 'EVM' | 'SUI' | 'SOL' | 'evm' | 'sui' | 'sol';
export interface ApiRequestPayload {
  walletId: string; // uuid: example 'b8d0b9e0-5d8c-11eb-ae93-0242ac130002'
  chainType: ChainType; // only support 'EVM' for now
}

export interface SignRequestPayload extends ApiRequestPayload {
  message: string | Bytes;
}
