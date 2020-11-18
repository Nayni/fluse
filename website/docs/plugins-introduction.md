---
id: plugin-introduction
title: Introduction
sidebar_label: Introduction
---

The first argument of the `create` function in a fixture definition is a `context` object.

This context is made up out of plugins, which can be configured when you [initialize](./initialize.md) Fluse.

```typescript
import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";
import typeormPlugin from "fluse-plugin-typeorm";

export const { fixture, combine, execute } = fluse({
  plugins: {
    orm: typeormPlugin(),
    faker: fakerPlugin(),
  },
});

export const userFixture = fixture<User>({
  // 'orm' and 'faker' are now available on the context.
  create({ orm, faker }) {
    const user = orm.entityManager.getRepository(User).create({
      username: faker.internet.userName(),
    });

    return orm.entityManager.save(user);
  },
});
```

A plugin can also allow for runtime options. This allows you to alter the behaviour of the plugin at during [execute](./execute.md).

```typescript
const { bob } = await execute(userFixture("bob"), {
  // We change the orm to use 'myconnection' instead of the default.
  orm: { connection: "myconnection" },
});
```

The combination of context and plugins allow Fluse to hook into any library of choice and even gain access to stateful resources such as a database connection you may wish to use.

Have a look at some of our [official plugins](./plugin-faker.md) or read our guide on how to [create your own](./create-plugin)!
