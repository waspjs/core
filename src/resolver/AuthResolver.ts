import { gql } from "apollo-server-core";
import { GraphQLError } from "graphql";
import Container from "typedi";
import { AuthToken, AuthTokenType, WaspContext } from "../lib";
import { UserManager } from "../manager/UserManager";
import { User, UserAuthType } from "../model/User";
import { MongoService, WaspResolver } from "../service";

@WaspResolver.Service()
export class AuthResolver extends WaspResolver {
  public mutations = gql`
    type Mutation {
      createSystemToken: AuthToken!
      createUserToken(id: String, email: String, password: String): AuthToken!
    }
  `;
  public types = gql`
    type AuthToken {
      token: String!
      type: AuthTokenType
      user: User!
    }
    enum AuthTokenType {
      ${Object.values(AuthTokenType).join("\n")}
    }
  `;

  private db = Container.get(MongoService);
  private userManager = Container.get(UserManager);

  @WaspResolver.mutation()
  public async createSystemToken(root: void, args: void, context: WaspContext): Promise<AuthToken> {
    if (!context.isSystem) {
      throw new GraphQLError("system token required");
    }
    return new AuthToken({
      type: AuthTokenType.System
    });
  }

  @WaspResolver.mutation()
  public async createUserToken(root: void, { id, email, password }: { id?: string, email?: string, password?: string }, context: WaspContext): Promise<AuthToken> {
    if (context.isUser) {
      id = context.userId;
    } else if (!(context.isSystem && id)) { // not authed
      if (!email || !password) {
        throw new GraphQLError("username and password are required");
      }
      const user = await this.db.users.findOne({ email }).exec();
      if (!user || user.auth.type !== UserAuthType.Local) {
        throw new GraphQLError("invalid email or password");
      }
      if (await this.userManager.auth.isValid(password, user.auth.local!.passwordHash)) {
        id = user._id;
      } else {
        throw new GraphQLError("invalid email or password");
      }
    }
    return new AuthToken({
      type: AuthTokenType.User,
      userId: id
    });
  }

  @WaspResolver.resolver("AuthToken.token")
  public token(root: AuthToken): string {
    return root.sign();
  }

  @WaspResolver.resolver("AuthToken.type")
  public type(root: AuthToken): AuthTokenType {
    return root.payload.type;
  }

  @WaspResolver.resolver("AuthToken.user")
  public async user(root: AuthToken): Promise<User> {
    if (!root.payload.userId) {
      throw new GraphQLError("not a user token");
    }
    return this.db.users.findById(root.payload.userId).exec() as Promise<User>;
  }
}
