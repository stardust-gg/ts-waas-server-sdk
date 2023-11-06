export default class AbstractStardustKeyPair {
  publicKey = async (message: string | Uint8Array): Promise<string> => {
    throw new Error('Method not implemented.');
  };

  address = async (message: string | Uint8Array): Promise<string> => {
    throw new Error('Method not implemented.');
  };

  sign = async (message: string | Uint8Array): Promise<string> => {
    throw new Error('Method not implemented.');
  };
}
