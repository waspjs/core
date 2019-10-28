import * as bcrypt from "bcrypt";
import { Service } from "typedi";

@Service()
export class UserAuthManager {
  public hash(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }
  public isValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
