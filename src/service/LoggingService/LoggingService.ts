import * as moment from "moment";
import { Service } from "typedi";
import { LogLevel } from "./LogLevel";

@Service()
export class LoggingService {
  private lastLogTime = moment(0);

  debug(name: string, data?: any) { return this.log(LogLevel.Debug, name, data); }
  info(name: string, data?: any) { return this.log(LogLevel.Info, name, data); }
  warn(name: string, data?: any) { return this.log(LogLevel.Warn, name, data); }
  error(name: string, err: Error, data?: any) { return this.log(LogLevel.Error, name, { err, ...data }); }

  protected log(level: LogLevel, name: string, data?: any) {
    const now = moment();
    let dateFormat = "HH:mm:ss";
    if (now.toDate().toLocaleDateString() !== this.lastLogTime.toDate().toLocaleDateString()) {
      dateFormat = "YYYY-MM-DD " + dateFormat;
      this.lastLogTime = now;
    }
    let extra = data;
    if (typeof(extra) === "object") {
      extra = Object.entries(extra || { }).map(([k, v]) =>
        v instanceof Error ? `${k}="${v.message}\n${v.stack}"` : `${k}=${JSON.stringify(v)}`
      ).join(" ");
    }
    console.log(`${now.format(dateFormat)} [${level}] [${name}] ${extra}`);
  }
}
