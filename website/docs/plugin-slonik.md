---
id: plugin-slonik
title: plugin-slonik
sidebar_label: plugin-slonik
---

A plugin to allow Fluse fixtures to interact with Slonik.

## Install

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<Tabs
defaultValue="yarn"
values={[
{ label: 'yarn', value: 'yarn', },
{ label: 'npm', value: 'npm', },
]
}>

<TabItem value="npm">

```bash
npm install fluse-plugin-slonik slonik --save-dev
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add -D fluse-plugin-slonik slonik
```

</TabItem>

</Tabs>

:::tip
This plugin requires `slonik` to be installed as well.
:::

## Example

```typescript
import { createExecutor, fixture } from "fluse";
import { createPool, sql } from "slonik";
import slonikPlugin from "fluse-plugin-slonik";

const pool = createPool("postgres://");
const execute = createExecutor({
  plugins: [slonikPlugin({ pool })],
});

const fooFixture = fixture({
  async create(ctx) {
    const foo = { name: "bar" };
    await ctx.slonik.query(sql`INSERT INTO foo ("name") VALUES (${foo.name})`);
    return foo;
  },
});

const result = await execute(fooFixture("foo"));
```

## API Reference

The `slonik` key will become available on the [context](./context.md) as you use this plugin.

### Signature

```
slonikPlugin(config?: {
  pool: DatabasePoolType;
  transaction?: boolean;
  onBefore?: (pool: DatabasePoolType) => Promise<void>;
  onAfter?: (pool: DatabasePoolType) => Promise<void>;
}) => Plugin
```

- `pool` **(required)**: The slonik connection pool.
- `transaction` **(optional)**: Run the fixture (or combined fixtures) in a single transaction, rolling back if something fails.
- `onBefore` **(optional)**: Function to run before fixtures are executed.
- `onAfter` **(optional)**: Function to run after fixtures are executed.
