import { idProp } from "../../util";

export class User {
  @idProp()
  public _id!: string;
}
