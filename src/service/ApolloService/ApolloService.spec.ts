// tslint:disable max-classes-per-file

import { gql } from "apollo-server-core";
import * as assert from "assert";
import Container from "typedi";
import { ConfigService } from "../ConfigService";
import { MockConfigService } from "../ConfigService/ConfigService.mock";
import { ContextService } from "../ContextService";
import { MockContextService } from "../ContextService/ContextService.mock";
import { LoggingService, LogLevel } from "../LoggingService";
import { MockLoggingService } from "../LoggingService/LoggingService.mock";
import { ApolloService } from "./ApolloService";
import { WaspResolver } from "./WaspResolver";

// ts-ignore comments are to disable "unused" warnings

describe("service", () => describe("ApolloService", () => {
  const apolloService = () => Container.get(ApolloService);
  const logger = () => Container.get(LoggingService) as any as MockLoggingService;

  beforeEach(() => {
    Container.reset();
    Container.set(ConfigService, new MockConfigService());
    Container.set(ContextService, new MockContextService());
    Container.set(LoggingService, new MockLoggingService());
  });

  describe("#findResolvers()", () => {
    it("should warn when none are found", () => {
      const { resolvers } = apolloService().findResolvers();
      assert.deepStrictEqual(resolvers, { });
      assert.deepStrictEqual(logger().logs, [{
        level: LogLevel.Warn,
        name: "apollo.noResolvers",
        data: undefined
      }]);
    });
    it("should return one correctly", () => {
      @WaspResolver.Service()
      // @ts-ignore
      class TestResolver1 extends Resolver {
        public queries = gql`
          type Query { test: String! }
        `;
        @WaspResolver.query()
        public test() { return "hello"; }
      }

      const { resolvers, schema } = apolloService().findResolvers();
      assert.strictEqual(resolvers.Query.test(), "hello");
      assert.strictEqual(schema, `type Mutation {\n}\ntype Query {\n  test: String!\n}`);
    });
    it("should warn when duplicates are found", () => {
      @WaspResolver.Service()
      // @ts-ignore
      class TestResolver1 {
        @WaspResolver.query()
        public test() { return "hello"; }

        @WaspResolver.query("test")
        public test2() { return "hello"; }
      }

      apolloService().findResolvers();
      assert.deepStrictEqual(logger().logs, [{
        level: LogLevel.Warn,
        name: "apollo.duplicateResolver",
        data: {
          type: "Query",
          field: "test",
          replacing: "TestResolver1.test2"
        }
      }]);
    });
  });
}));
