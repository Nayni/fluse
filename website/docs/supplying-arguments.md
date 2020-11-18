---
id: supplying-arguments
title: Supplying arguments
sidebar_label: Supplying arguments
---

Fixture definitions can optionally receive arguments. If you'd like to use arguments for your definition you have to explicitly type them.

Arguments will be available by accessing the second argument of the `create` function you must implement.

```typescript
interface PostArgs {
  author: User;
}

export const postFixture = fixture<Post, PostArgs>({
  create(context, args) {
    const post = new Post({
      title: context.faker.lorem.slug(),
      body: context.faker.lorem.paragraphs(4),
      author: args.author,
    });

    return post;
  },
});
```

Once you have defined your arguments you'll be required to supply them when executing the fixture.

```typescript
it("should require arguments to create a post", async () => {
  const { myPost } = await execute(
    postFixture("myPost", { args: { author: new User({ username: "bob" }) } })
  );
});
```

In the above example we are required to supply the `args` key with the typed arguments from the `postFixture`.

While creating an inline entity is perfectly valid. Fluse also supports nesting fixtures. If we had a fixture definition for creating a user we could re-write the above to:

```typescript
it("should be possible to nest", async () => {
  const { myPost } = await execute(
    postFixture("myPost", { args: { author: userFixture.asArg() } })
  );
});
```

Every fixture definition created with Fluse also has a static method `asArg` which can be used to nest fixtures. This allows you to create deeply nested structures easily without having to manually execute and wait for the result yourself.

In case the nested fixture requires arguments the `asArg` method will accept `args` just like a regular fixture.

:::note
Note that when using `asArg()` the `name` property is not required. Fluse will internally just consume the fixture annonymously and wait for the result.
:::
