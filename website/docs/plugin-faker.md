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
import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";

const { fixture, combine, execute } = fluse({
  plugins: {
    faker: fakerPlugin(),
  },
});

const userFixture = fixture<User>({
  create({ faker }) {
    const user = new User({
      username: faker.internet.userName(),
    });

    return user;
  },
});
```

## API Reference

The `faker` api will become available on the [context](./plugins-introduction.md) and a runtime option as you use this plugin.

### Signature

```
fakerPlugin(options?: { faker?: FakerStatic }) => Plugin
```
