import { StardustApp } from '@stardust-gg/stardust-custodial-sdk';

describe('StardustApp', () => {
  it('Should allow creating with optional params', async () => {
    const app = new StardustApp('name', 'email', 'description');
    expect(app).toBeDefined();
    expect(app.name).toEqual('name');
    expect(app.email).toEqual('email');
    expect(app.description).toEqual('description');
    expect(app.id).toBeNull();
    expect(app.apiKey).toBeNull();
  });
});
