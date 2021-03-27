<p align="center">
  <a href="https://nayni.github.io/fluse">
    <img alt="fluse logo" src="https://nayni.github.io/fluse/img/logo.svg" width="80" />
  </a>
</p>
<h1 align="center">
  Fluse
</h1>
<h2 align="center">
  Build composable and type-safe data-fixtures.
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

## Getting started

Install Fluse using `yarn`:

```
yarn add -D fluse
```

or `npm`:

```
npm install --save-dev fluse
```

## Documentation

Check out [the official documentation](https://nayni.github.io/fluse).

## The gist

Define fixtures based on your own data models.

```typescript
import { fluse } from "fluse";
import faker from "faker";
import { Comment } from "./model/Comment";
import { Post } from "./model/Post";
import { User } from "./model/User";

// Initialize fluse once
export const { fixture, scenario } = fluse();

// Define fixture definitions
export const userFixture = fixture<User>({
  create() {
    return new User({
      username: faker.internet.userName(),
    });
  },
});

export interface CommentArgs {
  author: User;
}

export const commentFixture = fixture<Comment, CommentArgs>({
  create(_ctx, args) {
    return new Comment({
      message: faker.lorem.slug(),
      author: args.author,
    });
  },
});

export interface PostArgs {
  author: User;
  comments: Comment[];
}

export const postFixture = fixture<Post, PostArgs>({
  create(_ctx, args) {
    return new Post({
      title: faker.lorem.slug(),
      body: faker.lorem.paragraphs(4),
      author: args.author,
      comments: args.comments,
    });
  },
});
```

Supercharge your tests!

```typescript
// Consume a fixture directly and let Fluse do the heavy lifting
it("should create many posts", async () => {
  const posts = await postFixture({
    author: userFixture(),
    comments: commentFixture({ author: userFixture() }).list(3),
  })
    .list(3)
    .execute();
});

// Compose fixtures together and make scenario's
it("should create a fixture scenario", async () => {
  const { bob, alice, bobsPosts, alicesPosts } = await scenario()
    .with("bob", userFixture())
    .with("alice", userFixture())
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

Find out more of the core concepts of Fluse like:

- [Supplying arguments](https://nayni.github.io/fluse/docs/supplying-arguments)
- [Lists](https://nayni.github.io/fluse/docs/lists)
- [Scenarios](https://nayni.github.io/fluse/docs/scenarios)
- [Plugins](https://nayni.github.io/fluse/docs/plugins-introduction)

## License

MIT
