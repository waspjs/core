import { UrlWithStringQuery } from "url";
import { Token, Service } from "typedi";

export abstract class AssetResolver {
  static token = new Token<AssetResolver>("assetResolver");
  static Service = () => Service({ id: AssetResolver.token, multiple: true });

  abstract protocol: string;
  abstract resolve(url: UrlWithStringQuery): string | undefined;
}
