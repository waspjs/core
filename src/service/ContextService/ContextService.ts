import { ContextFunction } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Service } from "typedi";
import { WaspContext } from "../../lib";

@Service()
export class ContextService {
  public getContext: ContextFunction<ExpressContext, object> = ({ req }) => new WaspContext(req);
}
