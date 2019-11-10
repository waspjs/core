import { prop } from "@typegoose/typegoose";

export class UserAuthLocal {
  @prop({ required: true })
  passwordHash!: string;

  @prop()
  resetToken?: string;
}
