---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

Fluse is a fixture builder. It allows you to build up fixtures in a **declarative**, **composable** and **type-safe** way.

## Why Fluse?

In order to test an application you'll likely need data, more specifically you'll need data in specific states.

When applications start off the strategy to create such data usually boils down to:

- inline entity creation when needed, i.e.: `const testUser = new User(/** ...props ... **/)`
- utility functions for making lists or related entities
- abusing built-in ORM solutions like migrations to seed databases

What I noticed is that these solutions never scale as the project grows, inline entity creation and utility functions are placed everywhere and ORM solutions like migrations are tedious to maintain and never play well in testing specific scenario's.

A good test starts with clear data requirements, so making that data should be easy (and preferably type-safe).

Fluse is the fixture builder I always wanted and hopefully you'll like it too. By adopting a slightly opinionated way of creating your test data you'll get a toolbelt of utility in return, this toolbelt consist of:

- A unified way of defining fixtures
- A declarative scenario builder, composing fixtures together
- Built-in supprt for [lists](./lists.md) and [deeply nested structures](./supplying-arguments.md)
- Type-safety all the way through
- Extensions in the form of [plugins](./plugins-introduction.md).

All of this might still sound vague, so let me take you through a "real world" example of how migrating to Fluse may look like.

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

// adding this comment to a post looks like:
post.addComment(comment);
```

Let's focus on a specific feature. Our blog application is able to list posts ordered by the most comments.

Writing a typical test for a feature like this might look something like this:

```typescript
// getPostsOrderedByCommentCount.test.ts
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

  const actual = await getPostsOrderedByCommentCount();

  expect(actual[0].id).toBe(bobsPost.id);
  expect(actual[1].id).toBe(alicesPost.id);
});
```

As you'll notice we wrote a lot of code to set up our test scenario.

What bothers me the most about this approach is that almost none of this code is relevant for our test. All we needed were a few posts, some comments and maybe a few users, we really don't care about things like user phone or email... yet it's cluttering our test. On top of that the actual test plus assertion is only 3 lines while setting everything up took up 10 times the space...

However, the attentive reader might argue:

- you could use `faker` to generate random data so you don't have to worry about username and phone numbers,
- you could refactor the setup code into a function
- you could test without database

And while all of the above is true the real problems remains: we don't have an opinionated approach for creating test data so we end up with a lot of custom code, code we have to also maintain.

Fluse was built to give you this slightly opinionated yet extensible workflow. It was designed to take away all your pains with creating (and maintaining) utility functions for single entities, lists and complex scenario's.

Let's re-build the example above with Fluse.

We start with initializing `fluse` and creating some fixture definitions:

:::note
This example will include a TypeORM plugin allowing us to re-write our test case with an actual database connection.
:::

```typescript
import { fluse } from "fluse";
import typeormPlugin from "fluse-plugin-typeorm";
import faker from "faker";
import { Comment } from "./entities/Comment";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

export const { fixture, scenario } = fluse({
  plugins: {
    orm: typeormPlugin(),
  },
});

export const userFixture = fixture<User>({
  create({ orm }) {
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
  create({ orm }, args) {
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
  create({ orm }, args) {
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

After some initial configuration of [plugins](./plugins-introduction.md) the first step of Fluse's workflow is to define **fixture definitions**. These definitions will be our primitive building blocks.

Fluse doesn't magically create entities or make any assumption about your data model. The model is yours, in this example we are using classes backed by TypeORM but Fluse will deal with anything as long as you tell it how to create it. Also notice how we only defined single entities, you'll see how we make lists in a second.

Now let's go back to our test:

```typescript
// getPostsOrderedByCommentCount.test.ts
import { userFixture, postFixture, commentFixture } from "./entities/fixtures";

const testScenario = scenario()
  .with("bob", userFixture())
  .with("alice", userFixture())
  .with("bobsPost", ({ bob }) =>
    postFixture({
      author: bob,
      comments: commentFixture({
        author: userFixture(),
      }).list(10),
    })
  )
  .with("alicesPost", ({ alice }) =>
    postFixture({
      author: alice,
      comments: commentFixture({
        author: userFixture(),
      }).list(5),
    })
  )
  .compose();

it("should return the posts ordered by their comment count (desc)", async () => {
  const { bobsPost, alicesPost } = await testScenario.execute();

  const actual = await getPostsOrderedByCommentCount();

  expect(actual[0].id).toBe(bobsPost.id);
  expect(actual[1].id).toBe(alicesPost.id);
});
```

The previously large chunk of distracting code inside our test has been replaced with a **declarative scenario**.

The scenario is built by composing our fixture definitions together. Notice how:

- The scenario is **declarative** by nature and can be **re-used**,
- The scenario is **type-safe**,
- The scenario has references to **named** objects that we chose during composition,
- We can go from a single entity to a list of entities by simply refering to it as a `list`,
- We can re-use fixture definitions in a **nested** way (i.e. to create a random user per comment),
- The fixtures are integrated and connected with TypeORM, testing with a database just became easy and type-safe!

Find out more about what you can do with Fluse such as:

- [Supplying arguments](./supplying-arguments.md)
- [Lists](./lists.md)
- [Scenarios](./scenarios.md)
- [Plugins](./plugins-introduction.md)
