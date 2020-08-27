---
id: api-fixture
title: fixture()
sidebar_label: fixture()
---

`fixture()` is the bread and butter of Fluse. It defines a single fixture which can be consumed directly or combined with other fixtures.

## Signature

```
fixture<TResult, TArgs>(config: {
  create: (context: FixtureContext, args: TArgs, list: { index: number, size: number }) => MaybePromise<TResult>;
}) => FixtureFactory<TResult, TArgs>
```

- `create` **(required)**: The function used to create the fixture's data set. The function receives a [context](./context.md) and optionally some typed [arguments](./supplying-arguments.md), you can also access list options in cases where the fixture is [created as a list](./making-lists.md).

## Example

```typescript
import { fixture } from "fluse";
import { User } from "./entities/User";

type UserFixtureArgs = {
  username: string;
};

const userFixture = fixture({
  async create(ctx, args: UserFixtureArgs) {
    const user = new User({ username: args.username });
    return user;
  },
});
```
