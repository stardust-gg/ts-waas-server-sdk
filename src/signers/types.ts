import EthersSigner from "./EthersSigner";
import PlaceHolderSigner from "./PlaceHolderSigner";

type EthersType = {
    ethers: EthersSigner;
}

type PlaceHolderType = {
    placeholder: PlaceHolderSigner;
}

export type Signers = EthersType & PlaceHolderType;