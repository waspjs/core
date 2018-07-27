declare module "memorystore" {
    import * as express from "express";
    import * as expressSession from "express-session";

    class MemoryStore extends expressSession.Store {
        constructor(options: {
            checkPeriod: number;
            max?: number;
            ttl?: number;
            dispose?(key: string, value: any): void;
            stale?: boolean;
            serializer?: {
                stringify: typeof JSON.stringify;
                parse: typeof JSON.parse;
            };
        });
        startInterval(): void;
        stopInterval(): void;
        prune(): void;
    }

    function init(session: typeof expressSession): typeof MemoryStore;
    export = init;
}
