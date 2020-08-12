---
id: combining-fixtures
title: Combining fixtures
sidebar_label: Combining fixtures
---

The big strength of Fluse lies in its re-usability. Creating a single fixture is great, but Fluse is built to help with complex data sets.

Instead of creating one big monolithic fixture Fluse allows you to combine multiple smaller fixtures into a bigger one. Allowing you to compose together data sets by re-using smaller parts you've defined before. On top of that Fluse does this in a type-safe way.

```typescript
// src/fixtures/userFixture.ts
import { fixture } from "fluse";
import { User } from "./entities/User";

type UserFixtureArgs = {
  username: string;
};

export const userFixture = fixture({
  async create(ctx, args: UserFixtureArgs) {
    const user = new User({ username: args.username });
    return user;
  },
});
```

Above is our first fixture. It creates a user with a given username. However in the system we are building users can make posts, thus we also have a posts fixture:

```typescript
// src/fixtures/postFixture.ts
import { fixture } from "fluse";
import { Post } from "./entities/Post";

type PostsFixtureArgs = {
  author: User;
};

export const postsFixture = fixture({
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
```

The above fixture creates 10 posts for a given author, a user.

Right now we have 2 separate fixtures. We could naïvely execute those fixtures in sequence, but with Fluse you can do better!

We can combine the above and use the output from the `userFixture` as input for the `postsFixture`:

```typescript
// src/seed.ts
import { combine } from "fluse";
import { userFixture } from "./fixtures/userFixture";
import { postFixture } from "./fixtures/postFixture";

const userWithPostsFixture = combine()
  .and(userFixture("foo", { username: "foo" }))
  .and(({ foo }) => postFixture("fooPosts", { author: foo }))
  .toFixture();
```

The above example shows how we've successfully combined both fixtures into a single fixture. We've also successfully passed the user that is being created from the first `userFixture` as the author of the second `postFixture`.

Let's go through this step by step:

- The `combine` function starts a [builder](./api-combine.md#combinedfixturebuilderand) that allows you to chain any number of fixtures together and combine them into a single result
- The `and` function allows you to pass any previously defined fixture as an argument, you consume that fixture just like any other fixture.
- Alternatively the `and` function also allows you to pass in a _factory function_. This factory function will receive any results from all previous fixtures in the chain (by name) and must return a consumed fixture. This way we are able to pass our user `foo` to the `postFixture` and make it the author of all the posts it creates.
- we end the chain my calling `toFixture()` which will produce a new fixture that is ready to be executed.

We can now use our new combined fixture to create all the data at once:

```typescript
import { createExecutor } from "fluse";
import { userFixture } from "./fixtures/userFixture";
import { postFixture } from "./fixtures/postFixture";

const execute = createExecutor();
const { foo, fooPosts } = await execute(userWithPostsFixture);
```

Notice how Fluse still provides you with a type-safe result which you can inspect and assert. The names you've chosen in the combined fixture are carried over into the result.
