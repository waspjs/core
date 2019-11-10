import { LogLevel } from "./LogLevel";

export interface MockLog {
  level: LogLevel;
  name: string;
  data?: any;
}

export class MockLoggingService {
  logs: MockLog[] = [];

  debug(name: string, data?: any) { return this.log(LogLevel.Debug, name, data); }
  info(name: string, data?: any) { return this.log(LogLevel.Info, name, data); }
  warn(name: string, data?: any) { return this.log(LogLevel.Warn, name, data); }
  error(name: string, err: Error, data?: any) { return this.log(LogLevel.Error, name, { err, ...data }); }

  protected log(level: LogLevel, name: string, data?: any) {
    this.logs.push({ level, name, data });
  }
}
