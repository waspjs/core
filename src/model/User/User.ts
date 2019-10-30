import { arrayProp, prop } from "@typegoose/typegoose";
import { idProp, ModelInit } from "../../util";
import { UserAuth } from "./auth";

export class User {
  @idProp()
  public _id!: string;

  @prop({ required: true, _id: false })
  public auth!: UserAuth;

  @prop({ required: true })
  public createdAt!: Date;

  @prop({ required: true })
  public email!: string;

  @arrayProp({ required: true, items: String })
  public permissions!: string[];

  @arrayProp({ required: true, items: String })
  public roleIds!: string[];

  public constructor(init?: ModelInit<User>) {
    Object.assign(this, init);
  }
}
