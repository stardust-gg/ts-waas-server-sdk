export default abstract class AbstractStardustSigner {
  public abstract getPublicKey(): Promise<string>;

  public abstract getAddress(): Promise<string>;

  public abstract signRaw(message: string | Uint8Array): Promise<string>;
}
