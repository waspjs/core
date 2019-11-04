import { arrayProp, prop } from "@typegoose/typegoose";
import { idProp, ModelInit } from "../../util";
import { UserAuth } from "./auth";

export class User {
  @idProp()
  _id!: string;

  @prop({ required: true, _id: false })
  auth!: UserAuth;

  @prop({ required: true })
  createdAt!: Date;

  @prop({ required: true })
  email!: string;

  @arrayProp({ required: true, items: String })
  permissions!: string[];

  @arrayProp({ required: true, items: String })
  roleIds!: string[];

  constructor(init?: ModelInit<User>) {
    Object.assign(this, init);
  }
}
