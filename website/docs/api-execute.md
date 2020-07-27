---
id: api-execute
title: execute()
sidebar_label: execute()
---

`execute()` allows you to run any particular fixture, this can be a single fixture or a combined fixture.

## Signature

```
execute<TResult>(
  fixture: Fixture<TResult>,
  options?: {
    plugins?: Plugin[];
  }
) => Promise<TResult>;
```

- `fixture` **(required)**: The fixture to execute, created by either [fixture()](./api-fixture.md) or by [combine()](./api-combine.md).
- `options` **(optional)**: Additional options including:
  - `plugins` **(optional)**: A set of plugins to use while executing.

## Example

```typescript
import { fixture, execute } from "fluse";

const fooFixture = fixture({
  async create() {
    return new Foo();
  },
});

const { foo } = await execute(fooFixture("foo"));
```
