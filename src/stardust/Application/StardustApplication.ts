import { StardustApplicationData } from './Types';

export default class StardustApplication {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public description: string | null = null
  ) {}

  public static generate(applicationData: StardustApplicationData): StardustApplication {
    return new StardustApplication(
      applicationData.id,
      applicationData.name,
      applicationData.email,
      applicationData.description
    );
  }
}
