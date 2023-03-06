TODO: coverage tests
TODO: look into to webpack to obfuscate the code
TODO: ncc for webpacking

Expected use
StardustCustodialSDK is our entry point to creating and getting apps

brand new app/ user etc

```ts
let stardustApp = new StardustApp('name', 'email', 'description');
stardustApp = await StardustCustodialSDK.createApp(stardustApp);
await clientDb.save(stardustApp.getApiKey());
```

existing app

```ts
const sdk = new StardustCustodialSDK('apiKey');
const stardustApp = await sdk.getApp();
const walletId = 'wallet-id'; // loaded in
const stardustWallet = await sdk.getWallet(walletId);
```
