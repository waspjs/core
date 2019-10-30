import { gql } from "apollo-server-core";
import { GraphQLError } from "graphql";
import { WaspContext } from "../lib";
import { UserManager } from "../manager/UserManager";
import { Role } from "../model/Role";
import { CorePermission } from "../model/shared/CorePermission";
import { User } from "../model/User";
import { WaspResolver } from "../service";
import { MongoService } from "../service/MongoService";

@WaspResolver.Service()
export class UserResolver extends WaspResolver {
  public mutations = gql`
    type Mutation {
      addRoleToUser(userId: String, roleId: String!): Boolean!
      createUser(email: String!, password: String!): User!
    }
  `;
  public queries = gql`
    type Query {
      user(id: String): User
      users(limit: Int!, offset: Int!): [User!]!
    }
  `;
  public types = gql`
    type User {
      _id: String!
      createdAt: Date!
      email: String!
      permissions: [String!]!
      roles: [Role!]!
    }
  `;

  constructor(
    private db: MongoService,
    private userManager: UserManager
  ) { super(); }

  @WaspResolver.mutation()
  public async addRoleToUser(root: void, { userId, roleId }: { userId?: string, roleId: string }, context: WaspContext): Promise<boolean> {
    if (context.isUser && !await context.hasPermission(CorePermission.ManageUsers)) {
      userId = context.userId;
    }
    if (!userId) {
      throw new GraphQLError("must provide id without user token");
    }
    const user = await this.db.users.findById(userId).exec();
    if (!user) {
      throw new GraphQLError("user not found");
    }
    const role = await this.db.roles.findById(roleId).exec();
    if (!role) {
      throw new GraphQLError("role not found");
    }
    await this.userManager.ops.addRole(user, role);
    return true;
  }

  @WaspResolver.mutation()
  public createUser(root: void, { email, password }: { email: string, password: string }) {
    return this.userManager.ops.create(email, password);
  }

  @WaspResolver.query()
  public async user(root: void, { id }: { id?: string }, context: WaspContext) {
    if (!id) {
      if (context.isUser) {
        id = context.userId;
      } else {
        throw new GraphQLError("must provide id without user token");
      }
    }
    return this.db.users.findById(id).exec();
  }

  @WaspResolver.query()
  public async users(root: void, { limit, offset }: { limit: number, offset: number }, context: WaspContext): Promise<User[]> {
    if (!await context.hasPermission(CorePermission.ManageUsers)) {
      throw new GraphQLError("not allowed");
    }
    return this.db.users.aggregate([{
      $sort: {
        email: 1
      }
    }, {
      $limit: limit
    }, {
      $skip: offset
    }]);
  }

  @WaspResolver.resolver("User.roles")
  public roles(root: User): Promise<Role[]> {
    return this.db.roles.find({
      _id: { $in: root.roleIds }
    }).exec();
  }
}
