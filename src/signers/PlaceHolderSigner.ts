export default class PlaceHolderSigner {
  constructor(readonly stardustWalletId: string) {}

  async getAddress(): Promise<string> {
    return 'placeholderAddress';
  }
}
