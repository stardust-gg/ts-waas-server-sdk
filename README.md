TODO: update licensing in package.json to reflect what we need legally

Expected use
StardustCustodialSdk is our entry point to creating and gettting apps

Create a fresh app

```ts
const stardustApp: StardustApp = await StardustCustodialSdk.createApp(
  'name',
  'email',
  'description'
);
await clientDb.save(stardustApp.apiKey);
```

Assuming we already created an app, and saved an api key. This is how we get the app

```ts
const apiKey = await clientDb.loadApiKey();
const stardustApp: StardustApp = await StardustCustodialSdk.getApp(apiKey);
```

One we have an app, this is how we create a wallet. make sure to save wallet id

```ts
const wallet: StardustWallet = await stardustApp.createWallet();
await clientDb.saveWallet(wallet.id);
```
