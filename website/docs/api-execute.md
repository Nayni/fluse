---
id: api-execute
title: execute()
sidebar_label: execute()
---

`execute()` allows you to run a particular fixture, this can be a single fixture or a combined fixture. The execute method is used to supply a [shared context object]() into your fixtures as well as allow [plugins]() to hook into the lifecycle of a fixture.

## Signature

```
execute<TResult>(
  fixture: Fixture<TResult>,
  options?: {
    plugins?: Plugin[];
  }
) => Promise<TResult>;
```

- `fixture` **(required)**: The fixture to execute, created by either [fixture()]() or by [combine()]().
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
