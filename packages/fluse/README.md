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

## The gist

Define fixtures based on your own data models.

```typescript
// file: fixtures.ts
import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";
import { Comment } from "./model/Comment";
import { Post } from "./model/Post";
import { User } from "./model/User";

export const { fixture, scenario } = fluse({
  plugins: {
    faker: fakerPlugin(),
  },
});

export const userFixture = fixture<User>({
  create({ faker }) {
    return new User({
      username: faker.internet.userName(),
    });
  },
});

export interface CommentArgs {
  author: User;
}

export const commentFixture = fixture<Comment, CommentArgs>({
  create({ faker }, args) {
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
  create({ faker }, args) {
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
// Consume a single fixture and let Fluse do the heavy lifting
it("should create many posts", async () => {
  const posts = await postFixture({
    author: userFixture(),
    comments: commentFixture({ author: userFixture() }).list(3),
  })
    .list(3)
    .execute();
});

// Make complex scenario's
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
- [Making lists](https://nayni.github.io/fluse/docs/making-lists)
- [Accessing context and plugins](https://nayni.github.io/fluse/docs/context)
- [Combining fixtures](https://nayni.github.io/fluse/docs/combining-fixtures)

## Documentation

Visit [the official documentation](https://nayni.github.io/fluse).

## Contributions

Got a question? found a bug? got a suggestion for a new plugin?

Feel free to reach out!

## License

MIT
