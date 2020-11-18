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
npm install fluse-plugin-slonik slonik @types/slonik --save-dev
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add -D fluse-plugin-slonik slonik @types/slonik
```

</TabItem>

</Tabs>

:::tip
This plugin requires `slonik` to be installed as well.
:::

## Example

```typescript
import { fluse } from "fluse";
import { createPool, sql } from "slonik";
import slonikPlugin from "fluse-plugin-slonik";

const pool = createPool("postgres://");

const { fixture, combine, execute } = fluse({
  plugins: {
    slonik: slonikPlugin({ pool }),
  },
});

const userFixture = fixture<User>({
  async create({ slonik }) {
    const result = await slonik.query<User>(
      sql`INSERT INTO users ("user_name") VALUES ('bob') RETURNING *`
    );

    return result.rows[0];
  },
});
```

## API Reference

The `slonik` api will become available on the [context](./plugin-introduction.md) and a runtime option as you use this plugin.

### Signature

```
slonikPlugin(options?: {
  pool: DatabasePoolType;
  transaction?: boolean;
}) => Plugin
```

- `pool` **(required)**: The slonik connection pool,
- `transaction` **(optional)**: Run in a single transaction, rolling back if something fails,
