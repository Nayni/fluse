---
id: plugin-typeorm
title: plugin-typeorm
sidebar_label: plugin-typeorm
---

A plugin to allow Fluse fixtures to interact with a TypeORM connection.

## Example

```typescript
import { execute, fixture } from "fluse";
import typeormPlugin from "fluse-plugin-typeorm";

const fooFixture = fixture({
  async create(ctx) {
    const foo = new Foo();
    return ctx.typeorm.entityManager.save(foo);
  },
});

const result = await execute(fooFixture("foo"), {
  plugins: [typeormPlugin({ connection: "default", transaction: true })],
});
```

## API Reference

The `typeorm` key will become available on the [context]() as you use this plugin.

### Signature

```
typeormPlugin(config?: {
  connection?: Connection | string;
  transaction?: boolean;
  synchronize?: boolean;
  dropBeforeSync?: boolean;
}) => Plugin
```

- `connection` **(optional)**: The name of the connection, or an instance of a TypeORM connection.
- `transaction` **(optional)**: Run the fixture (or combined fixtures) in a single transaction, rolling back if something fails.
- `synchronize` **(optional)**: Synchronize the database before running the fixture.
- `dropBeforeSync` **(optional)**: Drop the database entirely before sychronizing.
