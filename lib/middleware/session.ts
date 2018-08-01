import { Application } from "..";
import * as expressSession from "express-session";
import * as redisSession from "connect-redis";
import memoryStore = require("memorystore");

export default (app: Application) => {
    const store = app.redisClient
        ? new (redisSession(expressSession))({ client: app.redisClient })
        : new (memoryStore(expressSession))({ checkPeriod: 1000 * 60 * 60 * 24 });
    app.server.express.use(expressSession({
        store,
        resave: true,
        saveUninitialized: false,
        secret: app.config.session.secret
    }));
};
