---
id: api-execute
title: execute()
sidebar_label: execute()
---

Executes a fixture definition or scenario.

## Signature

```
execute(
  fixture: Fixture<TResult>,
  options?: { [key: string]: PluginOptions }
) => Promise<TResult>
```

- `fixture` **(required)**: A [fixture definition](./api-fixture.md) or [scenario](./api-combine.md),
- `options` **(optional)**: Runtime options for the configured plugins,

## Example

```typescript
import { fluse } from "fluse";
import typeormPlugin from "fluse-plugin-typeorm";

const { fixture, combine, execute } = fluse({
  plugins: {
    orm: typeormPlugin(),
  },
});

const scenario = combine()
  .and(userFixture("bob"))
  .and(({ bob }) =>
    postFixture("bobsPosts", {
      list: 5,
      args: {
        author: bob,
      },
    })
  )
  .toFixture();

// without runtime options
const { bob, bobsPosts } = await execute(scenario);

// with runtime options
const { alice } = await execute(userFixture("alice"), {
  orm: { connection: "default" },
});
```
