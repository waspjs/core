import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { concatAST, DocumentNode } from "graphql";
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
    const metadatas = findDecoratedMethods<{ name: string }, WaspResolver>(WaspResolver.token, "resolver");
    if (metadatas.length === 0) {
      this.logger.warn("apollo.noResolvers");
      return { resolvers: { }, schema: "" };
    }
    const resolvers: { [type: string]: { [field: string]: Function } } = { };

    metadatas.forEach(({ name, target, key }) => {
      const [type, field] = name.split(".");
      if (!resolvers[type]) {
        resolvers[type] = { };
      }
      if (resolvers[type][field]) {
        this.logger.warn("apollo.duplicateResolver", { type, field, replacement: `${target.constructor.name}.${key}` });
      }
      (resolvers[type] as any)[field] = (target as any)[key].bind(target);
    });

    const buildSchema = (nodes: (DocumentNode | undefined)[], typeName?: string): string => {
      let schema = printNode(concatAST(_.compact(nodes)));
      if (typeName) {
        schema = `type ${typeName} {\n${schema.replace(new RegExp(`type ${typeName} \\{([^\\}]+)\\}`, "g"), "$1")}}`;
      }
      return schema;
    };

    return {
      resolvers,
      schema: [
        buildSchema(metadatas.map(m => m.target.types)),
        buildSchema(metadatas.map(m => m.target.mutations), "Mutation"),
        buildSchema(metadatas.map(m => m.target.queries), "Query")
      ].join("\n").trim().replace(/\n\n/g, "\n") // making it a bit nicer to print
    };
  }
}
