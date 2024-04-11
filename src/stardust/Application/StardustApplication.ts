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

  public toJson(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      description: this.description,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}
