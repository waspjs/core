import { prop } from "@typegoose/typegoose";
import { UserAuthLocal } from "./UserAuthLocal";
import { UserAuthType } from "./UserAuthType";

export class UserAuth {
  @prop({ required: true, enum: UserAuthType })
  type!: UserAuthType;

  @prop({ _id: false })
  local?: UserAuthLocal;
}
