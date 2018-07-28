import { Application } from "..";
import * as bodyParser from "body-parser";

export default (app: Application) => {
    app.server.express.use(bodyParser.urlencoded({
        extended: true
    }), bodyParser.json());
};
