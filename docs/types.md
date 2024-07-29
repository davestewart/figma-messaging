# Types

### Common

#### MessageHandler

> A function to handle top-level message requests

```ts
(handlerId: string, ...args: any[]) => void
```

### Bus

#### Handler

> A function to handle routed message requests

```ts
(...args: any[]) => void
```

#### Handlers

> A hash of Handler functions

```ts
Record<string, Handler>
```

## Next

Go:

- [Home](README.md)

