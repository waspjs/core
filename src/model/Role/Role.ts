import { arrayProp, prop } from "@typegoose/typegoose";
import { idProp, ModelInit } from "../../util";

export class Role {
  @idProp()
  public _id!: string;

  @prop({ required: true })
  public name!: string;

  @arrayProp({ required: true, items: String })
  public permissions!: string[];

  public constructor(init?: ModelInit<Role>) {
    Object.assign(this, init);
  }
}
