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
and<TResult>(fixture: Fixture<TResult>): CombinedFixtureBuilder<TFixtures & TResult>;
and<TResult>(fixtureFn: (fixtures: TFixtures) => Fixture<TResult>): CombinedFixtureBuilder<TFixtures & TResult>;
```

- `fixture/fixtureFn` **(required)**: A fixture, or a factory function receiving any of the previous fixture results in the chain and must return a new fixture.

### `CombinedFixtureBuilder.toFixture()`

Creates the combined fixture.

#### Signature

```
toFixture(): Fixture<TFixtures>;
```

## Example

```typescript
import { fixture, combine, execute } from "fluse";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

type UserFixtureArgs = {
  username: string;
};

export const userFixture = fixture({
  async create(ctx, args: UserFixtureArgs) {
    const user = new User({ username: args.username });
    return user;
  },
});

type PostsFixtureArgs = {
  author: User;
};

const postsFixture = fixture({
  async create(ctx, args: PostsFixtureArgs) {
    return Array(10)
      .fill(0)
      .map((_, index) => {
        const post = new Post({
          title: `post ${index}`,
          author: args.author,
        });
        return post;
      });
  },
});

const userWithPostsFixture = combine()
  .and(userFixture("foo", { username: "foo" }))
  .and(({ foo }) => postFixture("fooPosts", { author: foo }))
  .toFixture();
```
