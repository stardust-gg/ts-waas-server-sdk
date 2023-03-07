/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
export default class StardustApp {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public name: string,
    public email: string,
    public description: string | null = null,
    public id: string | null = null,
    public apiKey: string | null = null
  ) {}
}
