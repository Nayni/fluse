---
id: execute
title: Execute
sidebar_label: Execute
---

Once you have a fixture definition, you can execute it and let Fluse create it.

```typescript
it("should execute", async () => {
  const user = await userFixture().execute();
});
```

When using plugins the execute method can possibly be extended with additional options. These options are related to the plugin needing them. For example a plugin can allow you to pass in a connection pool to execute on.

```typescript
const pool = new Pool();

it("should execute", async () => {
  const user = await userFixture().execute({ slonik: { pool } });
});
```

Executing a single fixture definition like this isn't really exciting. Things will get more interesting as you start [working with arguments](./supplying-arguments.md) or [composing scenarios](./scenarios.md).
