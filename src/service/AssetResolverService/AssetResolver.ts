import { UrlWithStringQuery } from "url";
import * as express from "express";
import { Token, Service } from "typedi";

export abstract class AssetResolver {
  static token = new Token<AssetResolver>("assetResolver");
  static Service = () => Service({ id: AssetResolver.token, multiple: true });

  abstract pattern: RegExp;
  init(app: express.Application): Promise<void> {
    return Promise.resolve();
  }
  abstract resolve(url: UrlWithStringQuery): string | undefined;
}
