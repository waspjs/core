import Application from "./lib/Application";

async function main() {
    const app = new Application();
    await app.server.start();
}

main().catch(console.error);
