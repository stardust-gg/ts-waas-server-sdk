import { StardustCustodialSdk, StardustApp } from '../../src/index';

describe('StardustApp', () => {
  const name = 'name';
  const email = 'email';
  const description = 'description';
  let apiKey: string;
  let appId: string;
  it('Should create an app with all properties set properly', async () => {
    const stardustApp = await StardustCustodialSdk.createApp('name', 'email', 'description');
    apiKey = stardustApp.getApiKey();
    appId = stardustApp.id;
    expect(stardustApp).toBeDefined();
    expect(stardustApp.id).toEqual(appId);
    expect(stardustApp.name).toEqual(name);
    expect(stardustApp.email).toEqual(email);
    expect(stardustApp.description).toEqual(description);
  });

  it('Should return an already created app with all properties set properly', async () => {
    const stardustApp = await StardustCustodialSdk.getApp(apiKey);
    expect(stardustApp).toBeDefined();
    expect(stardustApp.id).toEqual(appId);
    expect(stardustApp.name).toEqual(name);
    expect(stardustApp.email).toEqual(email);
    expect(stardustApp.description).toEqual(description);
  });

  it('Should create a wallet instace', async () => {
    const stardustApp = await StardustCustodialSdk.getApp(apiKey);
    const stardustWallet = await stardustApp.createWallet();
    expect(stardustWallet).toBeDefined();
    expect(stardustWallet.id).toMatch(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    );
  });
});
