---
id: api-fixture
title: fixture()
sidebar_label: fixture()
---

`fixture()` is the bread and butter of Fluse. It defines a single fixture which can be consumed directly or combined with other fixtures.

## Signature

```
fixture<TResult, TArgs>(config: {
  create: (context: FixtureContext, args: TArgs, info: FixtureCreatorInfo) => MaybePromise<TResult>;
}) => FixtureFactory<TResult, TArgs>
```

- `create` **(required)**: The function used to create the fixture's data set. The function receives a [context](./plugin-introduction.md) and optionally some typed [arguments](./supplying-arguments.md), you can also access extra info such as list info in cases where the fixture is [created as a list](./making-lists.md).

## Example

```typescript
import { fixture } from "fluse";
import { User } from "./entities/User";

type UserFixtureArgs = {
  username: string;
};

const userFixture = fixture({
  create(ctx, args: UserFixtureArgs, info) {
    const user = new User({ username: args.username });
    return user;
  },
});
```
