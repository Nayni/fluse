---
id: supplying-arguments
title: Supplying arguments
sidebar_label: Supplying arguments
---

Whenever you define a fixture you can optionally define arguments. By adding arguments to your fixture you can allow consumers to control parts of the output of the fixture.

```typescript
import { fixture } from "fluse";

type UserFixtureArgs = {
  username: string;
};

export const userFixture = fixture({
  create(ctx, args: UserFixtureArgs) {
    const user = new User({ username: args.username });
    return user;
  },
});
```

In the example above we are allowing consumers to pass in a username for the created user. We do this by using the second argument of the `create` function. For type-safety we created a type for the arguments `UserFixtureArgs`.

Whenever the fixture is used now it will require additional arguments to be passed in.

```typescript
import { createExecutor } from "fluse";

const execute = createExecutor();
const result = await execute(
  userFixture("testUser", { args: { username: "test" } })
);
```

Notice how we pass in a username, as defined by our `UserFixtureArgs` type. If you are working in TypeScript Fluse will provide you with type information and in this case even complain if you try to use the fixture without passing in a username.

Supplying arguments can be very useful for controlling certain parts of a fixture, it is also a vital piece to enable you to [combine fixtures](./combining-fixtures.md).

:::info
While arguments can be very useful. We recommend to keep your arguments to a **minimum** to not bloat your fixtures.
:::
