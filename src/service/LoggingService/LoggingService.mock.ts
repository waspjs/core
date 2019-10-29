import { LogLevel } from "./LogLevel";

export interface MockLog {
  level: LogLevel;
  name: string;
  data?: any;
}

export class MockLoggingService {
  public logs: MockLog[] = [];

  public debug(name: string, data?: any) { return this.log(LogLevel.Debug, name, data); }
  public info(name: string, data?: any) { return this.log(LogLevel.Info, name, data); }
  public warn(name: string, data?: any) { return this.log(LogLevel.Warn, name, data); }
  public error(name: string, err: Error, data?: any) { return this.log(LogLevel.Error, name, { err, ...data }); }

  protected log(level: LogLevel, name: string, data?: any) {
    this.logs.push({ level, name, data });
  }
}
