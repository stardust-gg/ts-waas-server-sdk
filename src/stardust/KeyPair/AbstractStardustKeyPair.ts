export default abstract class AbstractStardustKeyPair {
  publicKey = async (): Promise<string> => {
    throw new Error('Method not implemented.');
  };

  address = async (): Promise<string> => {
    throw new Error('Method not implemented.');
  };

  sign = async (message: string | Uint8Array): Promise<string> => {
    throw new Error('Method not implemented.');
  };
}
