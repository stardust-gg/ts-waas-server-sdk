import EthersV5Signer from '../../../ethers/V5/EthersV5Signer';
import { StarkSigner, createStarkSigner, generateLegacyStarkPrivateKey } from '@imtbl/core-sdk';
import StardustSignerAPI from '../../StardustSignerAPI';
import { ChainType, SignRequestPayload } from '../../../types';
import AbstractStardustSigner from '../AbstractStardustSigner';
import EvmStardustSigner from '../evm/EvmStardustSigner';

export default class ImxStardustSigner extends EvmStardustSigner {
  public getSigner = async (signer: EthersV5Signer): Promise<StarkSigner> => {
    return createStarkSigner(await generateLegacyStarkPrivateKey(signer));
  };
}
