import {Injectable} from '@angular/core';
import {LogSchema, LogService} from "./generated";

@Injectable({
  providedIn: 'root',
})

/**
 * simple LoggerService
 * @param {msg} - warning massage to assign to the log
 * @returns {logWith} - log in Console with stated message and logLevel
 * @example
 * constructor (logger: LoggerService) {}
 *  function testMethod() {
 *    this.logger.warn("This Data might resolve to an Error")
 *  }
 **/

export class LoggerService {
  public logLevel: LogLevel = new LogLevel();

  constructor(private logapi: LogService) {
  }



  info(msg: string): void {
    this.logWith(this.logLevel.Info, msg);
  }
  warn(msg: string): void {
    this.logWith(this.logLevel.Warning, msg);
  }

  debug(msg: string): void {
    this.logWith(this.logLevel.Debug, msg);
  }

  critical(msg: string): void {
    this.logWith(this.logLevel.Critical, msg);
  }
  error(msg: string): void {
    this.logWith(this.logLevel.Error, msg);
  }


  private logWith(level: number, msg: string): void {
    const logMessage: LogSchema = { "message": msg }

    if (level <= this.logLevel.Error) {
      switch (level) {
        case this.logLevel.Info:
          this.logapi.infoLogInfoPost(logMessage).subscribe();
          return console.info(this.localTime() +msg);
        case this.logLevel.Warning:
          this.logapi.warningLogWarningPost(logMessage).subscribe();
          return console.warn(this.localTime() + '%c' + msg, 'color: #6495ED');
        case this.logLevel.Debug:
          this.logapi.debugLogDebugPost(logMessage).subscribe();
          return console.info(this.localTime() + '%c' + msg, 'color: #6495ED');
        case this.logLevel.Critical:
          this.logapi.criticalLogCriticalPost(logMessage).subscribe();
          return console.trace(this.localTime() +'%c' + msg, 'color: #DC143C');
        case this.logLevel.Error:
          this.logapi.errorLogErrorPost(logMessage).subscribe();
          return console.error(this.localTime() +'%c' + msg, 'color: #DC143C')
        default:
          console.info(msg);
      }
    }
  }

  localTime(): string {
    const date = new Date();
    return date.toISOString() + " "
  }
}

class LogLevel {
  Info = 1;
  Warning= 2;
  Debug = 3
  Critical = 4;
  Error = 5;
  constructor() { }
}
