import { createLogger, format, transports } from 'winston';

export default class Logger {
  private logger;

  constructor(loggingLevel: string) {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Console()],
    });
    this.logger.level = loggingLevel;
  }

  public log(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }
}
