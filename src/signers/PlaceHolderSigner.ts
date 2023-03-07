export default class PlaceHolderSigner {
  // eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
  constructor(readonly stardustWalletId: string) {}

  // eslint-disable-next-line class-methods-use-this
  async getAddress(): Promise<string> {
    return 'placeholderAddress';
  }
}
