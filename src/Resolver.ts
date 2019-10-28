import { DocumentNode } from "graphql";
import * as _ from "lodash";
import { Service, Token } from "typedi";

export const query = (name?: string) => defineResolver(key => `Query.${name || key}`);
export const mutation = (name?: string) => defineResolver(key => `Mutation.${name || key}`);
export const resolver = (name: string) => defineResolver(() => name);

function defineResolver(buildName: (key: string) => string) {
  return (target: any, key: string) => {
    Reflect.defineMetadata("resolver", { name: buildName(key) }, target, key);
  };
}

export class Resolver {
  public static token = new Token<Resolver>("resolver");
  public static Service = () => Service({ id: Resolver.token, multiple: true });

  public mutations?: DocumentNode;
  public queries?: DocumentNode;
  public types?: DocumentNode;
}
