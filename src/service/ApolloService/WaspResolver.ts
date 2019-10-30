import { DocumentNode } from "graphql";
import * as _ from "lodash";
import { Service, Token } from "typedi";

export class WaspResolver {
  public static token = new Token<WaspResolver>("resolver");
  public static Service = () => Service({ id: WaspResolver.token, multiple: true });

  public mutations?: DocumentNode;
  public queries?: DocumentNode;
  public types?: DocumentNode;

  public static query = (name?: string) => WaspResolver.define(key => `Query.${name || key}`);
  public static mutation = (name?: string) => WaspResolver.define(key => `Mutation.${name || key}`);
  public static resolver = (name: string) => WaspResolver.define(() => name);

  protected static define(buildName: (key: string) => string) {
    return (target: any, key: string) => {
      Reflect.defineMetadata("resolver", { name: buildName(key) }, target, key);
    };
  }
}
