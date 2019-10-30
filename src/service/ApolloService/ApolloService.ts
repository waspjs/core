import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { concatAST, DocumentNode, GraphQLScalarType } from "graphql";
import { print as printNode } from "graphql/language/printer";
import * as _ from "lodash";
import Container, { Service } from "typedi";
import { findDecoratedMethods } from "../../util";
import { ContextService } from "../ContextService";
import { LoggingService } from "../LoggingService";
import { WaspResolver } from "./WaspResolver";

@Service()
export class ApolloService {
  protected contextService = Container.get(ContextService);
  protected logger = Container.get(LoggingService);

  protected apollo!: ApolloServer;

  public init(app: express.Application) {
    const { resolvers, schema } = this.findResolvers();
    this.apollo = new ApolloServer({
      typeDefs: schema,
      resolvers,
      context: this.contextService.getContext.bind(this.contextService)
    });
    this.apollo.applyMiddleware({ app });
  }

  public findResolvers() {
    const metadatas = findDecoratedMethods<{ name: string }, WaspResolver>(WaspResolver.token, "resolver", v => v instanceof GraphQLScalarType);
    if (metadatas.length === 0) {
      this.logger.warn("apollo.noResolvers");
      return { resolvers: { }, schema: "" };
    }
    const resolvers: { [type: string]: { [field: string]: Function } } = { };

    metadatas.forEach(({ name, target, key, passedCustomCheck }) => {
      const [type, field] = name.split(".");
      if (!resolvers[type]) {
        resolvers[type] = { };
      }
      if (resolvers[type][field]) {
        this.logger.warn("apollo.duplicateResolver", { type, field, replacement: `${target.constructor.name}.${key}` });
      }
      const value = (target as any)[key];
      // Don't bind if it's a Scalar
      (resolvers[type] as any)[field] = passedCustomCheck ? value : value.bind(target);
    });

    const buildSchema = (nodes: (DocumentNode | undefined)[], typeName?: string): string => {
      let printedSchema = printNode(concatAST(_.compact(nodes)));
      if (typeName) { // Transform many "type typeName { ... }" blocks into one
        printedSchema = `type ${typeName} {\n${printedSchema.replace(new RegExp(`type ${typeName} \\{([^\\}]+)\\}`, "g"), "$1")}}`;
      }
      return printedSchema;
    };

    // Make sure we don't naively (oops) have duplicate schema entries
    const resolverClasses = _.uniqBy(metadatas, m => m.target.constructor.toString()).map(m => m.target);
    const schema = [
      buildSchema(resolverClasses.map(t => t.types)),
      buildSchema(resolverClasses.map(t => t.mutations), "Mutation"),
      buildSchema(resolverClasses.map(t => t.queries), "Query")
    ].join("\n").trim().replace(/\n\n/g, "\n"); // Making it a bit nicer to print

    return { resolvers, schema };
  }
}
