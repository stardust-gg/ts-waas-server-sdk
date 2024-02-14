import { ProfileIdentifierData } from './Types';

export default class StardustProfileIdentifier {
  constructor(
    public readonly id: string,
    public readonly rootUserId: string,
    public readonly profileId: string,
    public readonly service: string,
    public readonly value: string,
    public readonly createdAt: Date,
    public readonly apiKey: string | null = null
  ) {}

  public static generate(profileIdentifierData: ProfileIdentifierData): StardustProfileIdentifier {
    return new StardustProfileIdentifier(
      profileIdentifierData.id,
      profileIdentifierData.rootUserId,
      profileIdentifierData.profileId,
      profileIdentifierData.service,
      profileIdentifierData.value,
      new Date(profileIdentifierData.createdAt * 1000)
    );
  }
}
