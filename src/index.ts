import "reflect-metadata";
import "source-map-support/register";

export { gql, ForbiddenError } from "apollo-server-core";
export { Container, Service } from "typedi";

export * from "./manager/RoleManager";
export * from "./manager/UserManager";

export * from "./model/Role";
export * from "./model/User";

export * from "./lib";
export * from "./service";
export * from "./util";

export * from "./Application";
export * from "./WebServer";

import "./controller";
import "./resolver";

import Container from "typedi";
import { Application } from "./Application";
if (require.main && require.main.id === module.id) {
  console.log("THIS IS NOT A FULLY-FLEDGED APPLICATION.\nYou probably meant to start your application.");
  const app = Container.get(Application);
  app.init().then(() => app.start()).catch(console.error);
}
