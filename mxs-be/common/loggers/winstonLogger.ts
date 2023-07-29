import { promisify } from 'util';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

export class Logger {
  private logger: WinstonLogger;

  constructor(serviceName: string, env?: string) {
    const environment = env ? env.trim() : 'developement';
    const folder = process.env.LOG_FOLDER || './logs';
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf((info) => `${info.timestamp} [${info.level}] (${info.service}): ${info.message}`)
        //format.json()
      ),
      defaultMeta: { service: serviceName, environment: environment },
      transports: [
        new transports.File({ filename: `${folder}/${serviceName}/error.log`, level: 'error' }),
        new transports.File({ filename: `${folder}/${serviceName}/combined.log` }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf((info) => `${info.timestamp} [${info.level}] (${info.service}): ${info.message}`)
          //format.simple()
        ),
      }));
    }
  }

  public getLogger(){
    return this.logger;
  }

  errorAsync = promisify(this.error);
  warnAsync = promisify(this.warn);
  infoAsync = promisify(this.info);
  debugAsync = promisify(this.debug);
  verboseAsync = promisify(this.verbose);

  public error(message: string, metadata?: any) {
    this.logger.error(message, metadata);
  }

  public warn(message: string, metadata?: any) {
    this.logger.warn(message, metadata);
  }

  public info(message: string, metadata?: any) {
    this.logger.info(message, metadata);
  }

  public debug(message: string, metadata?: any) {
    this.logger.debug(message, metadata);
  }

  public verbose(message: string, metadata?: any) {
    this.logger.verbose(message, metadata);
  }
}

