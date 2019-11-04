import { DocumentNode } from "graphql";
import * as _ from "lodash";
import { Service, Token } from "typedi";

export class WaspResolver {
  static token = new Token<WaspResolver>("resolver");
  static Service = () => Service({ id: WaspResolver.token, multiple: true });

  mutations?: DocumentNode;
  queries?: DocumentNode;
  types?: DocumentNode;

  static query = (name?: string) => WaspResolver.define(key => `Query.${name || key}`);
  static mutation = (name?: string) => WaspResolver.define(key => `Mutation.${name || key}`);
  static resolver = (name: string) => WaspResolver.define(() => name);

  protected static define(buildName: (key: string) => string) {
    return (target: any, key: string) => {
      Reflect.defineMetadata("resolver", { name: buildName(key) }, target, key);
    };
  }
}
