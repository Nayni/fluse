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
  const post = await postFixture({
    author: new User({ username: "bob" }),
  }).execute();
});
```

> In the above example we are required to pass the author when consuming the `postFixture`. Fluse will automatically determine if arguments are required or not.

While creating an inline entity is perfectly valid. Fluse also supports nesting fixtures. If we had a fixture definition for creating a user we could re-write the above to:

```typescript
it("should be possible to nest", async () => {
  const post = await postFixture({
    author: userFixture(),
  }).execute();
});
```

Fixtures defined by Fluse will be automatically augmented to accept other fixtures as their input arguments. Fluse will unwrap these fixtures for you so you don't have to worry about execution order.
