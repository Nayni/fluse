---
id: plugin-faker
title: plugin-faker
sidebar_label: plugin-faker
---

A plugin to make Faker availabe on the Fluse context.

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
npm install fluse-plugin-faker faker @types/faker --save-dev
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add -D fluse-plugin-faker faker @types/faker
```

</TabItem>

</Tabs>

:::tip
This plugin requires `faker` to be installed as well.
:::

## Example

```typescript
import { createExecutor, fixture } from "fluse";
import fakerPlugin from "fluse-plugin-faker";

const execute = createExecutor({
  plugins: [fakerPlugin()],
});

const fooFixture = fixture({
  async create(ctx) {
    const foo = new Foo();
    foo.bar = ctx.faker.lorem.words(5);
    return foo;
  },
});

const result = await execute(fooFixture("foo"));
```

## API Reference

The `faker` key will become available on the [context]() as you use this plugin.

### Signature

```
fakerPlugin() => Plugin
```
