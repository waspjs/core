import * as express from "express";
import Container from "typedi";
import { User } from "../model/User";
import { MongoService } from "../service";
import { AuthToken, AuthTokenType } from "./AuthToken";

export class WaspContext {
  private db = Container.get(MongoService);

  private token?: AuthToken;
  private _user?: User;

  constructor(public readonly req: express.Request) {
    if (req.headers.authorization) {
      const [prefix, token] = req.headers.authorization.split(" ");
      if (prefix.toLowerCase() === "bearer") {
        this.token = AuthToken.parse(token);
      }
    } else if (req.query.token) {
      this.token = AuthToken.parse(req.query.token);
    }
  }

  get hasToken() {
    return !!this.token;
  }

  get isUser() {
    return this.token && this.token.payload.type === AuthTokenType.User;
  }
  get isSystem() {
    return this.token && this.token.payload.type === AuthTokenType.System;
  }

  get userId(): string | undefined {
    if (!this.token || !this.isUser) { return undefined; }
    return this.token.payload.userId;
  }
  public async user(): Promise<User | undefined> {
    if (this._user) { return this._user; }
    const userId = this.userId;
    if (!userId) { return; }
    const user = await this.db.users.findById(userId).exec();
    this._user = user || undefined;
    return this._user;
  }

  public async hasPermission(permission: string): Promise<boolean> {
    if (this.isSystem) {
      return true;
    }
    const user = await this.user();
    if (!user) {
      return false;
    }
    return user.permissions.includes(permission);
  }

}
