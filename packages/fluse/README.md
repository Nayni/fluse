<p align="center">
  <a href="https://nayni.github.io/fluse">
    <img alt="fluse logo" src="https://nayni.github.io/fluse/img/logo.svg" width="80" />
  </a>
</p>
<h1 align="center">
  Fluse
</h1>
<h2 align="center">
  Build composable and types-afe data-fixtures.
</h2>

<br />

<p align="center">
  <a href="https://github.com/Nayni/fluse">
    <img alt="fluse ci badge" src="https://github.com/nayni/fluse/workflows/ci/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/Nayni/fluse">
    <img alt="fluse codecov badge" src="https://codecov.io/gh/Nayni/fluse/branch/master/graph/badge.svg" />
  </a>
  <a href="https://github.com/Nayni/fluse/blob/master/LICENSE.md">
    <img alt="fluse license badge" src="https://badgen.net/github/license/nayni/fluse" />
  </a>
</p>

<br />

> Fluse is still **under development**.

## Getting started

Install Fluse using `yarn`:

```
yarn add -D fluse
```

or `npm`:

```
npm install --save-dev fluse
```

Next, define your fixtures. Here are some quick examples:

```typescript
import { fixture } from "fluse";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

export const userFixture = fixture({
  create() {
    const user = new User({ username: args.username });
    return user;
  },
});
```

```typescript
type PostFixtureArgs = {
  author: User;
};

export const postFixture = fixture({
  create(ctx, args: PostFixtureArgs, { index }) {
    const post = new Post({
      title: `post ${index}`,
      author: args.author,
    });
    return post;
  },
});
```

Supercharge your tests by combining fixtures together:

```typescript
import { createExecutor, combine } from "fluse";
import { userFixture } from "./fixtures/userFixture";
import { postFixture } from "./fixtures/postFixture";
import findMostPopularPost from "./findMostPopularPost";

const execute = createExecutor();

const userWithPostsFixture = combine()
  .and(userFixture("foo"))
  .and(({ foo }) =>
    postFixture({ name: "fooPosts", list: 10 }, { author: foo })
  )
  .toFixture();

it("should find the most popular post", async () => {
  const { foo, fooPosts } = await execute(userWithPostsFixture);
  const mostPopular = findMostPopularPost(foo, fooPosts);

  expect(mostPopular).toBeDefined();
});
```

Find out what more you can do with Fluse by checking out our [official documentation](https://nayni.github.io/fluse).

## Documentation

Visit [the official documentation](https://nayni.github.io/fluse).

## Contributions

Got a question? found a bug? got a suggestion for a new plugin?

Feel free to reach out!

## License

MIT
