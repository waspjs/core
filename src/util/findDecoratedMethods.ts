import * as _ from "lodash";
import Container, { Token } from "typedi";

export function findDecoratedMethods<Metadata, Target extends any>(token: Token<Target>, metadataKey: string): (Metadata & {
  target: Target;
  key: string;
})[] {
  return _.compact(_.flatten(Container.getMany(token).map(target =>
    Object.getOwnPropertyNames(target.constructor.prototype).map(key => {
      if (!Reflect.hasMetadata(metadataKey, target, key)) { return; }
      if (typeof((target as any)[key]) !== "function") {
        throw new Error(`Expected ${target}.${key} to be a function`);
      }
      return {
        ...Reflect.getMetadata(metadataKey, target, key),
        target, key
      };
    })
  )));
}
