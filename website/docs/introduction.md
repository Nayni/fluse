---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

Fluse is a data-fixture builder. It allows you to build up fixtures in a **declarative**, **composable** and **type-safe** way.

## Why Fluse?

Testing an application requires data, more specifically it requires data in certain states.

In almost every project I've worked on, creating test data would result in a combination of the following approaches:

- Inline entity creation (i.e.: `new User()`),
- Custom utility functions to make large sets of data
- External pacakges like `faker` to generate randomness
- Abusing the built-in ORM solutions like migrations to seed databases while testing

Sadly these solutions don't scale well and as time passes this quickly results in chaos.

Testing an application should be easy. This starts with generating test data for your application models. Fluse brings you a slightly opinionated way of creating test data using fixtures and in return gives you a toolbelt that consists of:

- A unified way of defining fixtures
- A declarative scenario builder, composing fixtures together
- Built-in supprt for [lists](./making-lists.md) and[ deeply nested structures](./supplying-arguments.md)
- Type-safety all the way through
- Extensions in the form of [plugins](./plugin-introduction.md).

This might all still sound a little vague so let me give you an example!

## Example case: The blog

Let's say we are building a blog. A blog typically has the following types of data: a `User`, a `Post` and a `Comment`.

Creating a user is fairly straight forward:

```typescript
const user = new User({
  firstName: "Bob",
  lastName: "The Builder",
  email: "bob@fluse.io",
  phone: "(711) 265-9193",
  country: "US",
});
```

Next up we have a post:

```typescript
const post = new Post({
  title: "How to test using fitures",
  body: "Lorem ipsum....",
  image: "https://photos.io/cat.jpg?size=200x200",
  author: user,
});
```

Lastly we have comments:

```typescript
const comment = new Comment({
  message: "Lorem ipsum....",
  author: user,
});
```

In order to add comments to a post, our post entity has a method `addComment(comment: Comment)`.

The feature we are building is to list posts based on the most comments given. A test for this feature would look something like this:

```typescript
// getPostsByCommentCount.test.ts
it("should return the posts ordered by their comment count (desc)", async () => {
  const bob = new User({
    firstName: "Bob",
    lastName: "The Builder",
    phone: "(711) 265-9193",
    country: "US",
    email: "bob@fluse.io",
  });
  const alice = new User({
    firstName: "Alice",
    lastName: "The Malice",
    phone: "(712) 265-9188",
    country: "US",
    email: "alice@fluse.io",
  });
  const bobsPost = new Post({
    title: "How to test using fitures",
    body: "Lorem ipsum....",
    image: "https://photos.io/cat.jpg?size=200x200",
    author: bob,
  });
  const bobsPostComments = Array(10)
    .fill(0)
    .map((_, index) => {
      const comment = new Comment({
        message: "Lorem ipsum....",
        author: new User({
          firstName: "Random",
          lastName: "Commenter",
          phone: "(711) 265-9193",
          country: "US",
          email: `commenter${index}@fluse.io`,
        }),
        post: bobsPost,
      });
    });
  bobsPostComments.forEach((comment) => {
    bobsPost.addComment(comment);
  });

  const alicesPost = new Post({
    title: "Unit or integration tests?",
    body: "Lorem ipsum....",
    image: "https://photos.io/cat.jpg?size=200x200",
    author: alice,
  });
  const alicesPostComments = Array(5)
    .fill(0)
    .map((_, index) => {
      const comment = new Comment({
        message: "Lorem ipsum....",
        author: new User({
          firstName: "Random",
          lastName: "Commenter",
          phone: "(711) 265-9193",
          country: "US",
          email: `commenter${index}@fluse.io`,
        }),
        post: alicesPost,
      });
    });
  alicesPostComments.forEach((comment) => {
    alicesPost.addComment(comment);
  });

  await db.save([bob, alice, bobsPost, alicesPost]);

  const actual = await getPostsByCommentCount();

  expect(actual[0].id).toBe(bobsPost.id);
  expect(actual[1].id).toBe(alicesPost.id);
});
```

Do you notice how much **imperative** code is required to set up our test data? All this code **distracts us** from what we are actually testing.

However, the attentive reader might consider:

- I could introduce `faker` here to generate all this data and make it more random
- I could refactor this setup code into its own function making the test itself less cluttered
- I could refactor so the database becomes a dependency of my setup code

This is true and is exactly why I created Fluse. I kept noticing that in every project I would end up doing the same things over and over: I craft utility functions for creating single entities, lists and complex scenario's.

The reality however ends up being a mixed bag of inline entity creations, scenario's and other utility functions.

Fluse was designed to **streamline** this process and give you a slightly opinionated workflow for creating data fixtures, by following this workflow Fluse in return gives you some additional benefits such as a **declarative** scenario builder and extra **utilities** for lists and deeply nested structures.

Let's re-build the example above with Fluse.

We start with initializing `fluse` and creating some fixture definitions:

```typescript
import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";
import typeormPlugin from "fluse-plugin-typeorm";
import { Comment } from "./entities/Comment";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

export const { fixture, combine, execute } = fluse({
  plugins: {
    faker: fakerPlugin(),
    orm: typeormPlugin(),
  },
});

export const userFixture = fixture<User>({
  create({ orm, faker }) {
    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      country: faker.address.countryCode(),
      email: faker.internet.email(),
    });

    return orm.entityManager.save(user);
  },
});

interface CommentArgs {
  author: User;
}

export const commentFixture = fixture<Comment, CommentArgs>({
  create({ orm, faker }, args) {
    const comment = new Comment({
      message: faker.lorem.slug(),
      author: args.author,
    });

    return orm.entityManager.save(comment);
  },
});

interface PostArgs {
  author: User;
  comments: Comment[];
}

export const postFixture = fixture<Post, PostArgs>({
  create({ orm, faker }, args) {
    const post = new Post({
      title: faker.lorem.slug(),
      body: faker.lorem.paragraphs(4),
      author: args.author,
    });

    if (args.comments.length) {
      args.comments.forEach((comment) => {
        post.addComment(comment);
      });
    }

    return orm.entityManager.save(post);
  },
});
```

After some initial configuration of [plugins](./plugin-introduction.md) the **first step** of Fluse's workflow is to define **fixture definitions**. These definitions will be our primitive building blocks.

:::note
Fluse is able to integrate with your favorite libraries by using plugins. In this example we configured a Faker plugin and a TypeORM plugin.
:::

Now let's go back to our test:

```typescript
// getPostsByCommentCount.test.ts
import {
  execute,
  userFixture,
  postFixture,
  commentFixture,
} from "./entities/fixtures";

const scenario = combine()
  .and(userFixture("bob"))
  .and(userFixture("alice"))
  .and(({ bob }) =>
    postFixture("bobsPost", {
      args: {
        author: bob,
        comments: commentFixture.asArg({
          list: 10,
          args: {
            author: userFixture.asArg(),
          },
        }),
      },
    })
  )
  .and(({ alice }) =>
    postFixture("alicesPosts", {
      args: {
        author: alice,
        comments: commentFixture.asArg({
          list: 5,
          args: {
            author: userFixture.asArg(),
          },
        }),
      },
    })
  )
  .toFixture();

it("should return the posts ordered by their comment count (desc)", async () => {
  const { bobsPosts, alicesPosts } = await execute(scenario);

  const actual = await getPostsByCommentCount();

  expect(actual[0].id).toBe(bobsPost.id);
  expect(actual[1].id).toBe(alicesPost.id);
});
```

The previously large chunk of imperative code has been replaced with a **declarative scenario**.

The scenario is built by composing our fixture definitions together. Notice how:

- The scenario is **declarative** by nature and can be **re-used**,
- The scenario is **type-safe**,
- The scenario has references to **named** objects that we chose on the spot,
- We can go from a single entity to a list of entities by simply refering to it as a `list`,
- We can re-use fixture definitions in a **nested** way (i.e. to create a random user per comment),
- We can use libraries like Faker and TypeORM by configuring them upfront in the form of **plugins**

Find out more about what you can do with Fluse such as:

- [Supplying arguments](./supplying-arguments.md)
- [Lists](./making-lists.md)
- [Combining fixtures](./combining-fixtures.md)
- [Plugins](./plugin-introduction.md)
