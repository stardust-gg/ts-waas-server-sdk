import { StardustCustodialSDK, StardustApp } from '../src';
const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
describe('e2e', () => {
  let apiKey: string;
  it('should create an app in the Stardust database', async () => {
    const app: StardustApp = new StardustApp('name', 'email', 'description');
    await StardustCustodialSDK.createApp(app);
    apiKey = app.apiKey!;
    expect(app).toBeDefined();
    expect(app.name).toEqual('name');
    expect(app.email).toEqual('email');
    expect(app.description).toEqual('description');
    expect(app.id).toMatch(uuidRegex);
    expect(app.apiKey).toMatch(uuidRegex);
  });

  it('should retrieve an app from the Stardust database', async () => {
    const sdk = new StardustCustodialSDK(apiKey);
    const app = await sdk.getApp();
    expect(app).toBeDefined();
    expect(app.name).toEqual('name');
    expect(app.email).toEqual('email');
    expect(app.description).toEqual('description');
    expect(app.id).toMatch(uuidRegex);
    expect(app.apiKey).toMatch(uuidRegex);
  });

  it('should create a wallet in the Stardust database', async () => {
    const sdk = new StardustCustodialSDK(apiKey);
    const wallet = await sdk.createWallet();
    expect(wallet).toBeDefined();
    expect(wallet.id).toMatch(uuidRegex);
  });
});
