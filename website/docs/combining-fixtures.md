---
id: combining-fixtures
title: Combining fixtures
sidebar_label: Combining fixtures
---

While [arguments](./supplying-arguments.md) and [lists](./making-lists.md) will get pretty far already. Fluse is designed to deal with more complex scenarios.

The `combine` method lets you do this in a declarative way.

```typescript
it("should create a complex scenario", async () => {
  const scenario = combine()
    .and(userFixture("bob"))
    .and(userFixture("alice"))
    .and(({ bob }) =>
      postFixture("bobsPosts", {
        list: 5,
        args: {
          author: bob,
          comments: commentFixture.asArg({
            list: 3,
            args: {
              author: userFixture.asArg(),
            },
          }),
        },
      })
    )
    .and(({ alice }) =>
      postFixture("alicesPosts", {
        list: 5,
        args: {
          author: alice,
          comments: commentFixture.asArg({
            list: 3,
            args: {
              author: userFixture.asArg(),
            },
          }),
        },
      })
    )
    .toFixture();

  const { bob, bobsPosts, alice, alicesPosts } = await execute(scenario);
});
```

The above example shows how we create a complex scenario using just 3 fixture definitions: `userFixture`, `postFixture` and `commentFixture`.

The `combine` builder is type-safe all the way through. You're able to use fixture data previously created in the chain and pass them as input to the next fixture making the possibilities almost endless.
