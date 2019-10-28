import Container, { Service } from "typedi";
import { UserAuthManager } from "./UserAuthManager";
import { UserOpManager } from "./UserOpManager";

@Service()
export class UserManager {
  public readonly auth = Container.get(UserAuthManager);
  public readonly ops = Container.get(UserOpManager);
}
