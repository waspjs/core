import Application from "./Application";
import { Context } from "./http";

export default class Plugin {
    public app!: Application;
    onStart?: () => Promise<void>;
    onStop?: () => Promise<void>;
    onRequest?: (context: Context) => Promise<void>;
}
