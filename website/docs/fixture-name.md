---
id: fixture-name
title: Fixture name
sidebar_label: Fixture name
---

Every fixture you create with Fluse will always require you to pass in _at least one_ argument during execution: **name**.

The name argument is used by Fluse to return the data back to you once it has been created.

```typescript
import { createExecutor, fixture } from "fluse";

const execute = createExecutor();

const fooFixture = fixture({
  create() {
    return new Foo();
  },
});

const { foo } = await execute(fooFixture("foo"));
const { bar } = await execute(fooFixture({ name: "bar" }));
```

As shown in the example above we define a fixture for `Foo`. We can execute this fixture multiple times, each execution however requires us to pass a name to identify the data set we just created. The name that we pick will be returned back to us as a named result.

When you are just working with a single data fixture this might sound like a bit of overhead. However Fluse doesn't restrict itself to just a single fixture. The name argument becomes very important when you start to [combine fixtures](./combining-fixtures.md).
