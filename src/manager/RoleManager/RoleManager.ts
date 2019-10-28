import { Service } from "typedi";
import { Role } from "../../model/Role";
import { MongoService } from "../../service";

@Service()
export class RoleManager {
  constructor(
    private db: MongoService
  ) { }

  public async create(name: string) {
    const count = await this.db.roles.countDocuments({ name }).exec();
    if (count > 0) {
      throw new Error("role with that name already exists");
    }
    return this.db.roles.create(new Role({
      name,
      permissions: []
    }));
  }

  public async addPermissions(role: Role, permissions: string[]) {
    await this.db.roles.updateOne({
      _id: role._id
    }, {
      $addToSet: {
        permissions: {
          $each: permissions
        }
      }
    }).exec();
  }
}
