import { parse as parseUrl } from "url";
import * as express from "express";
import Container, { Service } from "typedi";
import { AssetResolver } from "./AssetResolver";
import "./resolver";

@Service()
export class AssetResolverService {
  private resolvers = Container.getMany(AssetResolver.token);

  async init(app: express.Application) {
    await Promise.all(this.resolvers.map(r => r.init(app)));
  }

  resolve(rawUrl: string): string | undefined {
    const resolver = this.resolvers.find(r => r.pattern.test(rawUrl));
    return resolver && resolver.resolve(parseUrl(rawUrl));
  }
}
