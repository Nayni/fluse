---
id: api-execute
title: createExecutor()
sidebar_label: createExecutor()
---

`createExecutor()` creates an executor which allows you to run any particular fixture, this can be a single fixture or a combined fixture.

## Signature

```
createExecutor(options?: {
  plugins?: Plugin[]
}) => (fixture: Fixture<TResult>) => Promise<TResult>
```

- `options` **(optional)**: Additional options including:
  - `plugins` **(optional)**: A set of plugins to use while executing.
- `fixture` **(required)**: The fixture to execute, created by either [fixture()](./api-fixture.md) or by [combine()](./api-combine.md).

## Example

```typescript
import { createExecutor, fixture } from "fluse";

const execute = createExecutor({
  plugins: [
    /* pass plugins */
  ],
});

const fooFixture = fixture({
  create() {
    return new Foo();
  },
});

const { foo } = await execute(fooFixture("foo"));
const { manyFoos } = await execute(fooFixture("manyFoos", { list: 10 }));
```
