---
id: execute
title: Execute
sidebar_label: Execute
---

Once you have a fixture definition, you can execute it and let Fluse create it.

When you execute a fixture definition it is required to give it a name. The importance of this name will become clear once you start [combining fixtures](./combining-fixtures.md).

```typescript
it("should execute", async () => {
  const { bob } = await execute(userFixture("bob"));
});
```

Executing a single fixture definition like this isn't really exciting. Things will get more interesting as you start [working with arguments](./supplying-arguments.md) or [combining fixtures](./combining-fixtures.md).
