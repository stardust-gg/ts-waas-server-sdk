import { StardustApp } from '../src/index';
import { CreateApplicationPayload } from '../src/types';

const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

describe('StardustApp tests', () => {
  //   it('should be defined', async () => {
  //     const sampleApiKey = '4e9dc2f2-94cd-4a6f-a207-ee7663e81f0c';
  //     const stardustApp: StardustApp = new StardustApp(sampleApiKey);
  //     expect(stardustApp).toBeDefined();
  //   });

  it('Should create an app and return an api key', async () => {
    const app: CreateApplicationPayload = {
      name: 'Coffee Drinkers Anonymous',
      email: 'andrew.gutierrez@stardust.gg',
      description: 'sup bois!!',
    };
    const { stardustApp, apiKey } = await StardustApp.createApp(app);

    expect(stardustApp).toBeDefined();
    expect(apiKey).toMatch(uuidRegex);
  });

  it.todo('Should fail to create StardustApp instance if bad api key provided');
  it.todo('Should create a wallet instance');
});

// examples for Nick. What is the best way to create an instance of the StardustApp? Dillemma: We cannot await the constructor, but we need
// to make a call (at some point) to our API to get app information for subsequent calls on that app. What is the best way to do this?
// 1: await at the instance method level
// 2: await at the static class method when retrieving an instance of that same class
// 3: have a StartustSdk top level class with only static methods. Await at the StardustSdk level to get an instance of the StardustApp
// const someExamples = async () => {
//   // 1 - instantiate class with new operator
//   const stardustApp1 = new StardustApp(apiKey); // no validation until a method is called as below
//   const name1 = await stardustApp2.name;



//   // 2 - instantiate class in factory like pattern (static method to get an instance of class)
//   const stardustApp2 = await StardustApp.getApp(apiKey); // validate and get params immediately so subsequent call needs to make no requests
//   const name2 = stardustApp3.name;



//   // 3 - use an SDK as the most top level class to return an Instance of the app object
//   // hesitate to put create app in stardust sdk class.
//   const { stardustApp3, apiKey } = await StardustCustodialSdk.createApp(app);

//   const stardustApp4 = await StardustCustodialSdk.getApp(apiKey);
//   const name3_4 = stardustApp4.name;



//   await stardustApp5.getWallet(walletid)
// };




// StardustSDK is just an index more than a class. Or maybe a very light orchestrator class. Create app and getApp method on it, but they dont directly make the http calls
// basically, 3 can use something like 2 in its implementation.
