import * as dotenv from "dotenv";
import "reflect-metadata";
import Container, { Service } from "typedi";
import { LoggingService } from "../LoggingService";

dotenv.config();

interface ConfigMetadata<T = string> {
  isRequired: boolean;
  key: string;
  fieldName: string;
  transformer?: (value: string) => T;
}

@Service()
export class ConfigService {
  @ConfigService.required("AUTH_JWT_KEY")
  authJwtKey!: string;

  @ConfigService.required("HTTP_PORT", Number)
  httpPort!: number;

  @ConfigService.optional("NODE_ENV", e => e === "development")
  inDevelopment!: boolean;

  @ConfigService.required("MONGO_URL")
  mongoUrl!: string;

  @ConfigService.optional("OBJECT_STORAGE_DIR")
  objectStorageDir?: string;

  @ConfigService.required("STATIC_SYSTEM_TOKEN")
  staticSystemToken!: string;

  constructor() {
    const configs = Reflect.getMetadata("configs", this);
    for (const { fieldName, key, transformer, isRequired } of configs) {
      const value = process.env[key];
      if (!value && isRequired) {
        Container.get(LoggingService).error("config.required", new Error("Missing environment variable " + key));
        process.exit(1);
      }
      (this as any)[fieldName] = transformer ? transformer(value) : value;
    }
  }

  protected static define<T>(target: ConfigService, metadata: ConfigMetadata<T>) {
    const configs: ConfigMetadata<any>[] = Reflect.getMetadata("configs", target) || [];
    configs.push(metadata);
    Reflect.defineMetadata("configs", configs, target);
  }

  protected static optional<T = string>(key: string, transformer?: (value: string) => T) {
    return (target: ConfigService, fieldName: keyof ConfigService) => {
      ConfigService.define(target, { isRequired: false, key, transformer, fieldName });
    };
  }

  protected static required<T = string>(key: string, transformer?: (value: string) => T) {
    return (target: ConfigService, fieldName: keyof ConfigService) => {
      ConfigService.define(target, { isRequired: true, key, transformer, fieldName });
    };
  }
}
