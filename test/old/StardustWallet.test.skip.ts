import { StardustCustodialSdk, StardustWallet } from '../src';

describe('StardustWallet', () => {
  it('Should be able to retrieve both and ethers signer and a placeholder signer', async () => {
    const stardustApp = await StardustCustodialSdk.createApp('name', 'email', 'description');
    const stardustWallet = await StardustWallet.create(stardustApp);
    const { ethers, placeholder } = stardustWallet.signers;
    expect(ethers).toBeDefined();
    expect(placeholder).toBeDefined();
    expect(await ethers.getAddress()).toEqual('ethersAddress');
    expect(await placeholder.getAddress()).toEqual('placeholderAddress');
  });
});
