export default abstract class AbstractStardustSigner {
  getPublicKey = async (): Promise<string> => {
    throw new Error('Method not implemented.');
  };

  getAddress = async (): Promise<string> => {
    throw new Error('Method not implemented.');
  };

  signRaw = async (message: string | Uint8Array): Promise<string> => {
    throw new Error('Method not implemented.');
  };
}
