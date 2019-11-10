import * as bcrypt from "bcrypt";
import { Service } from "typedi";

@Service()
export class UserAuthManager {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }
  isValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
