# Middleware

Middleware is defined by placing a TypeScript file in `/lib/middleware`, which exports a default function with this signature:

```typescript
(app: Application) => void;
```
