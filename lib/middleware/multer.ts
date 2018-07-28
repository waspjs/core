import { Application } from "..";
import * as multer from "multer";

export default (app: Application) => {
    app.server.express.use(multer({
        storage: multer.memoryStorage()
    }).any());
};
