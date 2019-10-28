import { prop } from "@typegoose/typegoose";

export class UserAuthLocal {
  @prop({ required: true })
  public passwordHash!: string;

  @prop()
  public resetToken?: string;
}
