import * as jwt from "jsonwebtoken";
import Container from "typedi";
import { ConfigService } from "../service/ConfigService";

export interface AuthTokenPayload {
  type: AuthTokenType;
  userId?: string;
}

export enum AuthTokenType {
  System = "system",
  User = "user"
}

export class AuthToken {
  constructor(public payload: AuthTokenPayload) { }

  public sign() {
    const config = Container.get(ConfigService);
    return jwt.sign(this.payload, config.authJwtKey);
  }

  public static parse(token: string) {
    const config = Container.get(ConfigService);
    if (!token) {
      return undefined;
    }
    if (token === config.staticSystemToken) {
      return new AuthToken({
        type: AuthTokenType.System
      });
    }
    const payload = jwt.verify(token, config.authJwtKey) as string | AuthTokenPayload;
    if (typeof(payload) === "string" || !("type" in payload)) {
      throw new Error(`bad token payload: ${JSON.stringify(payload)}`);
    }
    return new AuthToken(payload);
  }
}
