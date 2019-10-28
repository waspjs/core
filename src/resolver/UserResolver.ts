import { gql } from "apollo-server-express";
import Container from "typedi";
import { query, Resolver } from "../Resolver";
import { MongoService } from "../service";

@Resolver.Service()
export class UserResolver extends Resolver {
  public types = gql`
    type User {
      _id: String!
    }
  `;
  public queries = gql`
    type Query {
      users: [User!]!
    }
  `;

  private db = Container.get(MongoService);

  @query()
  public async users() {
    return this.db.users.find().exec();
  }
}
