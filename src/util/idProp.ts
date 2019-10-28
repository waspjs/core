import { prop } from "@typegoose/typegoose";
import * as randomstring from "randomstring";

export function idProp(options?: Parameters<typeof prop>[0]) {
  return prop({
    default: () => randomstring.generate({ length: 16 }),
    ...options
  });
}
