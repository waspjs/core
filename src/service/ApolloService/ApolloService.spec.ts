import * as assert from "assert";
import Container from "typedi";
import { query, Resolver } from "../../Resolver";
import { ConfigService } from "../ConfigService";
import { MockConfigService } from "../ConfigService/ConfigService.mock";
import { ContextService } from "../ContextService";
import { MockContextService } from "../ContextService/ContextService.mock";
import { LoggingService } from "../LoggingService";
import { MockLoggingService } from "../LoggingService/LoggingService.mock";
import { ApolloService } from "./ApolloService";

describe("service", () => describe("ApolloService", () => {
  const apolloService = () => Container.get(ApolloService);

  beforeEach(() => {
    Container.reset();
    Container.set(ConfigService, new MockConfigService());
    Container.set(ContextService, new MockContextService());
    Container.set(LoggingService, new MockLoggingService());
  });

  describe("#findResolvers()", () => {
    it("should return none correctly", () => {
      const { resolvers } = apolloService().findResolvers();
      assert.deepStrictEqual(resolvers, { });
    });
    it("should return one correctly", () => {
      @Resolver.Service()
      // @ts-ignore
      class TestResolver1 {
        @query()
        public test() { return "hello"; }
      }

      const { resolvers } = apolloService().findResolvers();
      assert.strictEqual(resolvers.Query.test(), "hello");
    });
  });
}));
