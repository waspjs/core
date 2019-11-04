import { parse as parseUrl } from "url";
import Container, { Service } from "typedi";
import { AssetResolver } from "./AssetResolver";
import "./resolver";

@Service()
export class AssetResolverService {
  private resolvers = Container.getMany(AssetResolver.token);

  resolve(rawUrl: string): string | undefined {
    const url = parseUrl(rawUrl);
    if (!url.protocol) {
      return undefined;
    }
    const resolver = this.resolvers.find(r => (r.protocol + ":") === url.protocol);
    console.log(url, resolver && resolver.resolve(url));
    return resolver && resolver.resolve(url);
  }
}
