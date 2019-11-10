import Container, { Service } from "typedi";
import { UserAuthManager } from "./UserAuthManager";
import { UserOpManager } from "./UserOpManager";

@Service()
export class UserManager {
  readonly auth = Container.get(UserAuthManager);
  readonly ops = Container.get(UserOpManager);
}
