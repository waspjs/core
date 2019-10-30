import { ForbiddenError, gql } from "apollo-server-core";
import { GraphQLError } from "graphql";
import { Container } from "typedi";
import { WaspContext } from "../lib";
import { RoleManager } from "../manager/RoleManager";
import { Role } from "../model/Role";
import { CorePermission } from "../model/shared/CorePermission";
import { MongoService, WaspResolver } from "../service";

@WaspResolver.Service()
export class RoleResolver extends WaspResolver {
  public mutations = gql`
    type Mutation {
      addPermissionsToRole(roleId: String!, permissions: [String!]!): Boolean!
      createRole(name: String!): Role!
    }
  `;
  public queries = gql`
    type Query {
      roles: [Role!]!
    }
  `;
  public types = gql`
    type Role {
      _id: String!
      name: String!
      permissions: [String!]!
    }
  `;

  private db = Container.get(MongoService);
  private roleManager = Container.get(RoleManager);

  @WaspResolver.query()
  public async roles() {
    return this.db.roles.find({ }).exec();
  }

  @WaspResolver.mutation()
  public async addPermissionsToRole(root: void, { roleId, permissions }: { roleId: string, permissions: CorePermission[] }, context: WaspContext): Promise<boolean> {
    if (!await context.hasPermission(CorePermission.ManageRoles)) {
      throw new ForbiddenError("manage roles");
    }
    const role = await this.db.roles.findById(roleId).exec();
    if (!role) {
      throw new GraphQLError("role not found");
    }
    await this.roleManager.addPermissions(role, permissions);
    return true;
  }

  @WaspResolver.mutation()
  public async createRole(root: void, { name }: { name: string }, context: WaspContext): Promise<Role> {
    if (!await context.hasPermission(CorePermission.ManageRoles)) {
      throw new ForbiddenError("manage roles");
    }
    return this.roleManager.create(name);
  }
}
