import { gql } from "apollo-server-core";
import * as GraphqlDatetime from "graphql-type-datetime";
import { WaspResolver } from "../service";

@WaspResolver.Service()
export class DateResolver extends WaspResolver {
  public types = gql`
    scalar Date
  `;

  @WaspResolver.resolver("Date")
  public readonly date = GraphqlDatetime;
}
