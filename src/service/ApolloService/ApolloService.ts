import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { concatAST, DocumentNode } from "graphql";
import { print as printNode } from "graphql/language/printer";
import * as _ from "lodash";
import Container, { Service } from "typedi";
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
    const targets = Container.getMany(WaspResolver.token);
    if (targets.length === 0) {
      this.logger.warn("apollo.noResolvers");
      return { resolvers: { }, schema: "" };
    }

    // tslint doesn't like using Function
    // tslint:disable-next-line ban-types
    const resolvers: { [type: string]: { [field: string]: Function } } = { };

    targets.forEach((target: any) => Object.getOwnPropertyNames(target.constructor.prototype).map(key => {
      if (!Reflect.hasMetadata("resolver", target, key)) { return; }
      if (typeof(target[key]) !== "function") {
        throw new Error("Can't use " + target.constructor.name + "." + key + " as a resolver");
      }
      const { name } = Reflect.getMetadata("resolver", target, key);
      const [type, field] = name.split(".");
      if (!resolvers[type]) { resolvers[type] = { }; }
      if (resolvers[type][field]) {
        this.logger.warn("apollo.duplicateResolver", { type, field, replacing: `${target.constructor.name}.${key}` });
      }
      (resolvers[type] as any)[field] = target[key].bind(target);
    }));

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
        buildSchema(targets.map(t => t.types)),
        buildSchema(targets.map(t => t.mutations), "Mutation"),
        buildSchema(targets.map(t => t.queries), "Query")
      ].join("\n").trim().replace(/\n\n/g, "\n") // making it a bit nicer to print
    };
  }
}
