import Application from "./Application";
import { Context } from "./http";

export default class Plugin {
    // tslint seems to have a problem with the ! suffix
    public app!: Application; // tslint:disable-line
    onStart?: () => Promise<void>;
    onStop?: () => Promise<void>;
    onRequest?: (context: Context) => Promise<void>;
}
