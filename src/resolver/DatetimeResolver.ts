import { gql } from "apollo-server-core";
import * as GraphqlDatetime from "graphql-type-datetime";
import { WaspResolver } from "../service";

@WaspResolver.Service()
export class DatetimeResolver extends WaspResolver {
  public types = gql`
    scalar Date
    scalar Datetime
  `;

  @WaspResolver.resolver("Date")
  @WaspResolver.resolver("Datetime")
  public readonly Datetime = GraphqlDatetime;
}
