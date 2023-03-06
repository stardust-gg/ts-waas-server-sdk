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
  walletId: string;
  chainType: 'EVM';
  chainId: number;
}

export interface SignRequestPayload extends ApiRequestPayload {
  message: string | Bytes;
}
