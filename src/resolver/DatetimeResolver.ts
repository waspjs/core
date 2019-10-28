import { gql } from "apollo-server-core";
import * as GraphqlDatetime from "graphql-type-datetime";
import { Resolver, resolver } from "../Resolver";

@Resolver.Service()
export class DatetimeResolver extends Resolver {
  public types = gql`
    scalar Date
    scalar Datetime
  `;

  @resolver("Date")
  @resolver("Datetime")
  public readonly Datetime = GraphqlDatetime;
}
