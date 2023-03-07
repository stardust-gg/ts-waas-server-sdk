export default class StardustApp {
  constructor(
    public name: string,
    public email: string,
    public description: string | null = null,
    public id: string | null = null,
    public apiKey: string | null = null
  ) {}
}
