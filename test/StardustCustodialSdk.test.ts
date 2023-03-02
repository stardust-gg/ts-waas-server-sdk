import { StardustCustodialSdk } from '../src/index';

const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

describe('StardustCustodialSdk tests', () => {
  let apiKey: string;
  let appId: string;
  const name = 'dfsdf app';
  const email = 'trex@asdf.gg';
  const description = null;
  it('Should create an app and return an api key', async () => {
    const { stardustApp, apiKey: key } = await StardustCustodialSdk.createApp(
      name,
      email,
      description
    );
    apiKey = key;
    appId = stardustApp.getId();
    expect(stardustApp).toBeDefined();
    expect(apiKey).toMatch(uuidRegex);
  });

  it('Should retrieve an already created app', async () => {
    const stardustApp = await StardustCustodialSdk.getApp(apiKey);
    expect(stardustApp).toBeDefined();
    expect(stardustApp.getId()).toEqual(appId);
  });

  it('Should fail to retrieve an already created StardustApp instance if bad api key provided', async () => {
    try {
      await StardustCustodialSdk.getApp('bad-api-key');
      expect(false).toBeTruthy(); // should never get here
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it.todo('Should create a wallet instance');
});
