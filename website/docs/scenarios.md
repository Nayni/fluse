---
id: scenarios
title: Scenarios
sidebar_label: Scenarios
---

The usage of [arguments](./supplying-arguments.md) and [lists](./lists.md) will get pretty far already, but Fluse is designed to deal with more complex scenarios.

The `scenario` api lets you do this in a declarative way.

```typescript
it("should create a complex scenario", async () => {
  const { bob, alice, bobsPosts, alicesPosts } = await scenario()
    // with a simple fixture
    .with("bob", userFixture())
    .with("alice", () => userFixture())
    // with an array of fixtures
    .with(
      "others",
      ["Dave", "John"].map((username) => userFixture({ username }))
    )
    // with a factory fn that allows you to refer to previous values in the chain
    .with("bobsPosts", ({ bob }) =>
      postFixture({
        author: bob,
        comments: commentFixture({
          author: userFixture(),
        }).list(3),
      }).list(5)
    )
    .with("alicesPosts", ({ alice }) =>
      postFixture({
        author: alice,
        comments: commentFixture({
          author: userFixture(),
        }).list(3),
      }).list(5)
    )
    .compose()
    .execute();
});
```

The above example shows how we create a complex scenario using just 3 fixture definitions: `userFixture`, `postFixture` and `commentFixture`.

The `scenario` composer is type-safe all the way through. You're able to use fixture data previously created in the chain and pass them as input to the next fixture making the possibilities almost endless.
