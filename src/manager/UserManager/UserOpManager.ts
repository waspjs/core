import * as _ from "lodash";
import Container, { Service } from "typedi";
import { Role } from "../../model/Role";
import { User, UserAuthType } from "../../model/User";
import { MongoService } from "../../service";
import { UserAuthManager } from "./UserAuthManager";

@Service()
export class UserOpManager {
  private authManager = Container.get(UserAuthManager);
  private db = Container.get(MongoService);

  public async create(email: string, password: string) {
    const count = await this.db.users.countDocuments({ email }).exec();
    if (count > 0) {
      throw new Error("user with that email already exists");
    }
    return this.db.users.create(new User({
      auth: {
        type: UserAuthType.Local,
        local: {
          passwordHash: await this.authManager.hash(password)
        }
      },
      createdAt: new Date(),
      email,
      permissions: [],
      roleIds: []
    }));
  }

  public async addRole(user: User, role: Role) {
    await this.db.users.updateOne({
      _id: user._id
    }, {
      $addToSet: {
        roleIds: role._id,
        permissions: {
          $each: role.permissions
        }
      }
    }).exec();
  }

  public async removeRole(user: User, role: Role) {
    const remainingRoles = await this.db.roles.find({
      _id: {
        $and: [{
          $in: user.roleIds
        }, {
          $ne: role._id
        }]
      }
    }).exec();
    await this.db.users.updateOne({
      _id: user._id
    }, {
      $pull: {
        roleIds: role._id
      }
    }).exec();
    await this.db.users.updateOne({
      _id: user._id
    }, {
      $set: {
        permissions: _.flatten(remainingRoles.map(r => r.permissions))
      }
    }).exec();
  }
}
