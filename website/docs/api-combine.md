---
id: api-combine
title: combine()
sidebar_label: combine()
---

`combine()` is a builder function that allows you to combine multiple single fixtures into a bigger fixture.

## Signature

```
combine() => CombinedFixtureBuilder;
```

### `CombinedFixtureBuilder.and()`

Chains an additional fixture onto the combined fixture.

#### Signature

```
and<TResult>(fixture: Fixture<TResult>) => CombinedFixtureBuilder<TFixtures & TResult>;
and<TResult>(fixtureFn: (fixtures: TFixtures) => Fixture<TResult>) => CombinedFixtureBuilder<TFixtures & TResult>;
```

- `fixture/fixtureFn` **(required)**: A fixture, or a factory function receiving any of the previous fixture results in the chain and must return a new fixture.

### `CombinedFixtureBuilder.toFixture()`

Creates the combined fixture.

#### Signature

```
toFixture() => Fixture<TFixtures>;
```

## Example

```typescript
import { fixture, combine } from "fluse";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

type UserFixtureArgs = {
  username: string;
};

const userFixture = fixture({
  create(ctx, args: UserFixtureArgs) {
    const user = new User({ username: args.username });
    return user;
  },
});

type PostFixtureArgs = {
  author: User;
};

const postFixture = fixture({
  create(ctx, args: PostFixtureArgs, info) {
    const post = new Post({
      title: `post ${info.list.index}`,
      author: args.author,
    });
    return post;
});

const bobWithPosts = combine()
  .and(userFixture("bob", { args: { username: "Bob" } }))
  .and(({ bob }) => postFixture("bobsPosts", { list: 10, args: { author: bob } }))
  .toFixture();

const execute = createExecutor();
const result = await execute(bobWithPosts);

result.bob // User
result.bobsPosts // Post[]
```
