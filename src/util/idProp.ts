import { prop } from "@typegoose/typegoose";
import * as randomstring from "randomstring";

export const idProp = (options?: Parameters<typeof prop>[0]) =>
  prop({
    default: () => randomstring.generate({ length: 16 }),
    ...options
  });
