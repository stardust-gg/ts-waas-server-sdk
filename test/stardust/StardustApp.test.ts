import { StardustApplication } from '../../src';

describe('StardustApplication', () => {
  it('Should allow creating with optional params', async () => {
    const app = new StardustApplication('id-here', 'name', 'email', 'description');
    expect(app).toBeDefined();
    expect(app.name).toEqual('name');
    expect(app.email).toEqual('email');
    expect(app.description).toEqual('description');
    expect(app.apiKey).toBeNull();
  });
});
