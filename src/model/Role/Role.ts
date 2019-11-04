import { arrayProp, prop } from "@typegoose/typegoose";
import { idProp, ModelInit } from "../../util";

export class Role {
  @idProp()
  _id!: string;

  @prop({ required: true })
  name!: string;

  @arrayProp({ required: true, items: String })
  permissions!: string[];

  constructor(init?: ModelInit<Role>) {
    Object.assign(this, init);
  }
}
