import { StardustProfileIdentifierData, StardustProfileIdentifierService } from './Types';

export default class StardustProfileIdentifier {
  constructor(
    public readonly id: string,
    public readonly rootUserId: string,
    public readonly profileId: string,
    public readonly service: string,
    public readonly value: string,
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
      new Date(profileIdentifierData.createdAt * 1000)
    );
  }

  // TODO: implement opinionated validation for each service type
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static validateIdentifier(service: StardustProfileIdentifierService, value: string) {
    switch (service) {
      case StardustProfileIdentifierService.Email:
      case StardustProfileIdentifierService.Phone:
      case StardustProfileIdentifierService.Discord:
      case StardustProfileIdentifierService.Apple:
      case StardustProfileIdentifierService.Google:
      case StardustProfileIdentifierService.Facebook:
      case StardustProfileIdentifierService.Twitter:
      case StardustProfileIdentifierService.Custom:
      default:
        return true; // Default validation for services without specific rules
    }
  }
}
