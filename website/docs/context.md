---
id: context
title: Accessing context
sidebar_label: Accessing context
---

Every fixture you create with Fluse has the ability to access a context object. This context object is used by `plugins` to provide you with additional functionalities such as:

- stateful connections like a database connection
- utility functions to help in generating random data

Context is Fluse's way of allowing you to plug into the lifecycle of a fixture and access any resources that might need to live outside of your fixture scope such as database connections. It will always be the first argument of a fixture.

```typescript
import { createExecutor, fixture } from "fluse";
import fakerPlugin from "fluse-plugin-faker";

const execute = createExecutor({
  plugins: [fakerPlugin()],
});

const fooFixture = fixture({
  async create(context) {
    return new Foo(context.faker.lorem.words(5));
  },
});

const { foo } = await execute(fooFixture("foo"));
```

Have a look at some of our official plugins:

- [plugin-typeorm](./plugin-typeorm.md)
- [plugin-faker](./plugin-faker.md)
