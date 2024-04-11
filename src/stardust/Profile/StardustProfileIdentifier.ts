import { StardustProfileIdentifierData, StardustProfileIdentifierType } from './Types';

export default class StardustProfileIdentifier {
  constructor(
    public readonly id: string,
    public readonly rootUserId: string,
    public readonly profileId: string,
    public readonly service: string,
    public readonly value: string,
    public readonly type: StardustProfileIdentifierType,
    public readonly createdAt: Date
  ) {}

  public static generate(
    profileIdentifierData: StardustProfileIdentifierData
  ): StardustProfileIdentifier {
    return new StardustProfileIdentifier(
      profileIdentifierData.id,
      profileIdentifierData.rootUserId,
      profileIdentifierData.profileId,
      profileIdentifierData.service,
      profileIdentifierData.value,
      profileIdentifierData.type,
      new Date(profileIdentifierData.createdAt * 1000)
    );
  }

  public toJson(): any {
    return {
      id: this.id,
      profileId: this.profileId,
      service: this.service,
      value: this.value,
      type: this.type,
      createdAt: this.createdAt,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}
