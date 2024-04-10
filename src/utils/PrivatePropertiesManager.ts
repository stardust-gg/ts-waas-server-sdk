/* eslint-disable no-param-reassign */
export default class PrivatePropertiesManager {
  static readonly PRIVATE_KEY: unique symbol = Symbol('PRIVATE_KEY');

  public static initPrivateProperties<T extends object>(object: T): T {
    (object as any)[PrivatePropertiesManager.PRIVATE_KEY] = {};
    return object;
  }

  public static setPrivateProperty<T extends object, K extends keyof any, V>(
    object: T,
    key: K,
    value: V
  ): void {
    if (!(object as any)[PrivatePropertiesManager.PRIVATE_KEY]) {
      PrivatePropertiesManager.initPrivateProperties(object);
    }
    (object as any)[PrivatePropertiesManager.PRIVATE_KEY][key] = value;
  }

  public static getPrivateProperty<T extends object, K extends keyof any, V>(
    object: T,
    key: K
  ): V | undefined {
    return (object as any)[PrivatePropertiesManager.PRIVATE_KEY]
      ? (object as any)[PrivatePropertiesManager.PRIVATE_KEY][key]
      : undefined;
  }
}
