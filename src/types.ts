import { Bytes } from '@ethersproject/bytes';
import EthersSigner from './signers/EthersSigner';
import PlaceHolderSigner from './signers/PlaceHolderSigner';

type EthersType = {
  ethers: EthersSigner;
};

type PlaceHolderType = {
  placeholder: PlaceHolderSigner;
};

export type Signers = EthersType & PlaceHolderType;

export interface ApiRequestPayload {
  walletId: string; // uuid: example 'b8d0b9e0-5d8c-11eb-ae93-0242ac130002'
  chainType: 'EVM'; // only support 'EVM' for now
  chainId: string; // chainId of the network
}

export interface SignRequestPayload extends ApiRequestPayload {
  message: string | Bytes;
}
