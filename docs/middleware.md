# Middleware

Express middleware is defined by placing a TypeScript file in `/lib/middleware`, which exports a default function with this signature:

```typescript
(app: Application) => void;
```

That function should add middleware via `app.server.express.*`, usually `.use()`.
