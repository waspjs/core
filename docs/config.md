# Configuration

Configuration is used throughout Wasp to connect to external services, provide API tokens, and so on. You should not commit configuration files to source code repositories.

## Usage
Config values are provided to `Application` on construction, usually by the following snippet:

```typescript
import * as wasp from "@wasp/core";

const app = new wasp.Application(await wasp.config.loadFromDir(__dirname + "/config"));
```

Configuration values are accessed (or transformed, but you really shouldn't do that) via `Application.config`.

Configuration files are named by a specific scheme: for instance, the config key `redis.host` would be in `./config/redis.json` (assuming the config is being loaded with the snippet above), the contents of which would be:

```json
{
  "host": "localhost"
}
```

## Structure

Various plugins may add more structures to this, but with just `@wasp/core`, the structure looks something like this:

```typescript
type Configuration = {
    http: {
        port: number;
    };
    redis: {
        host: string;
        port: number;
    };
};
```
