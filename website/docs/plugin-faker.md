---
id: plugin-faker
title: plugin-faker
sidebar_label: plugin-faker
---

A plugin to make Faker availabe on the Fluse context.

## Example

```typescript
import { execute, fixture } from "fluse";
import fakerPlugin from "fluse-plugin-faker";

const fooFixture = fixture({
  async create(ctx) {
    const foo = new Foo();
    foo.bar = ctx.faker.lorem.words(5);
    return foo;
  },
});

const result = await execute(fooFixture("foo"), {
  plugins: [fakerPlugin()],
});
```

## API Reference

The `faker` key will become available on the [context]() as you use this plugin.

### Signature

```
fakerPlugin() => Plugin
```
