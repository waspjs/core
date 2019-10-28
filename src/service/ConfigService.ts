import * as dotenv from "dotenv";
import Container, { Service } from "typedi";
import { LoggingService } from "./LoggingService";

dotenv.config();

@Service()
export class ConfigService {
  @ConfigService.required("AUTH_JWT_KEY")
  public authJwtKey!: string;

  @ConfigService.required("HTTP_PORT", Number)
  public httpPort!: number;

  @ConfigService.required("MONGO_URL")
  public mongoUrl!: string;

  @ConfigService.required("STATIC_SYSTEM_TOKEN")
  public staticSystemToken!: string;

  protected static setValue<T>(key: string, transformer?: (value: string) => T) {
    return (target: ConfigService, fieldName: keyof ConfigService) => {
      const value = process.env[key];
      if (!value) {
        return false;
      }
      (target as any)[fieldName] = transformer ? transformer(value) : value;
      return true;
    };
  }

  protected static optional<T = string>(key: string, transformer?: (value: string) => T) {
    return (target: ConfigService, fieldName: keyof ConfigService) => {
      this.setValue(key, transformer)(target, fieldName);
    };
  }

  protected static required<T = string>(key: string, transformer?: (value: string) => T) {
    return (target: ConfigService, fieldName: keyof ConfigService) => {
      const isFound = this.setValue(key, transformer)(target, fieldName);
      if (!isFound) {
        Container.get(LoggingService).error("config.required", new Error("Missing environment variable " + key));
        process.exit(1);
      }
    };
  }
}
