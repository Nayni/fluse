---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

Fluse is a fixture builder. It allows you to build up fixtures in a composable and type-safe way.

## Why Fluse?

Testing your application or business logic requires input data, as applications grow in complexity providing that input data becomes more and more challenging:

- entities become interconnected
- getting an entity into a specific state for testing requires a (large) series of steps or other data to be created
- your logic might be tightly coupled to a database or ORM solution requiring you to persist it first

When trying to maintain this type of code there tends to be two common approaches:

- write a lot of custom code to create fixtures, writing this code is tedious and maintaining it is even worse
- try to leverage the built-in ORM's solution of seeding the database. This solution usually boils down to abusing the migrations system and starts to fall short when you intensively use this data in your tests

Fluse is a tool specifically designed to help you in making **re-usable** and **type-safe** data fixtures. It allows you to define **small** and **composable** building blocks for creating test data.

Fluse's sole focus is to help you create test data and doesn't tie itself to any ORM or database solution. You can however still connect Fluse to your ORM or database of choice by using one of our [official plugins](./context.md).

## What is a fixture?

A fixture is a function that knows how to create a certain type of data within your system.

This might sound a little vague so let's give you an example!

Let's say we are building a blog. A blog typically has the following types of data: a `User`, a `Post` and a `Comment`.

Creating a user is fairly straight forward:

```typescript
const user = new User({
  firstName: "Bob",
  lastName: "The Builder",
  phone: "(711) 265-9193",
  country: "US",
  email: "bob@fluse.io",
});
```

Next up we have a post which requires an `author`, a `title` and a `message`:

```typescript
const post = new Post({
  title: "How to test using fitures",
  message: "Lorem ipsum....",
  image: "https://picsum.photos/200",
  author: user,
});
```

Lastly we have comments which requires an `author`, a `title`, a `message` and a `post`.

```typescript
const comment = new Comment({
  title: "How to test using fitures",
  message: "Lorem ipsum....",
  author: user,
  post: post,
});
```

A comment can also be upvoted, or downvoted:

```typescript
comment.upvote();
comment.votes; // 1;

comment.downvote();
comment.votes; // 0;
```

A new feature we are building requires us to write a function that retrieves the most upvoted comment of a post. We've implemented the function `getMostUpvotedComment(comments: Comment[])`, time to test it!

```typescript
// getMostUpvotedComment.test.ts
it("should return the most upvoted comment", () => {
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
    message: "Lorem ipsum....",
    image: "https://picsum.photos/200",
    author: bob,
  });
  const comments = Array(10)
    .fill(0)
    .map((_, index) => {
      const comment = new Comment({
        title: "How to test using fitures",
        message: "Lorem ipsum....",
        author: alice,
        post: bobsPost,
      });
    });

  // upvote twice
  comments[0].upvote();
  comments[0].upvote();

  const actual = getMostUpvotedComment(comments);

  expect(actual).toBe(comments[0]);
});
```

This test does the job, but can you notice how much code was required before we got to the actual test? That's quite a lot and we're only building a simple blog wtih just 3 entities. Also know that we've only written **one** test here, creating a set of data that requires a user, post and comment(s) will be common in our blog, surely we can do better.

Let's see how this might look like if we add Fluse to the mix.

First up, creating a user, post or comment is going to be very common. Let's build some fixtures:

```typescript
// src/entities/fixtures.ts
import { fixture } from "fluse";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";

export const userFixture = fixture({
  create(ctx) {
    const user = new User({
      firstName: ctx.faker.name.firstName(),
      lastName: ctx.faker.name.lastName(),
      phone: ctx.faker.phone.phoneNumber(),
      country: ctx.faker.address.countryCode(),
      email: ctx.faker.internet.email(),
    });
    return user;
  },
});

type PostArgs = {
  author: User;
};

export const postFixture = fixture({
  create(ctx, args: PostArgs) {
    const post = new Post({
      title: ctx.faker.lorem.words(5),
      message: ctx.faker.lorem.words(40),
      image: ctx.faker.image.imageUrl(),
      author: args.author,
    });

    return post;
  },
});

type CommentArgs = {
  author: User;
  post: Post;
};

export const commentFixture = fixture({
  create(ctx, args: PostArgs) {
    const comment = new Comment({
      title: ctx.faker.lorem.words(5),
      message: ctx.faker.lorem.words(40),
      author: args.author,
      post: args.post,
    });

    return comment;
  },
});
```

Let's recap quickly what we've done here. We created 3 `fixtures`:

- a `userFixture` to create a random user
- a `postFixture` to create random post, for a given `author`
- a `commentFixture` to create random comment, for a given `author` and `post`

Now let's go back to our test:

```typescript
// getMostUpvotedComment.test.ts
import { createExecutor, combine } from "fluse";
import fakerPlugin from "fluse-plugin-faker";
import { userFixture, postFixture, commentFixture } from "./entities/fixtures";

const execute = createExecutor({ plugins: [fakerPlugin()] });

it("should return the most upvoted comment", async () => {
  const scenario = combine()
    .and(userFixture("bob"))
    .and(userFixture("alice"))
    .and(({ bob }) => postFixture("bobsPost", { author: bob }))
    .and(({ alice, bobsPost }) =>
      commentFixture(
        { name: "alicesComments", list: 10 },
        { author: alice, post: bobsPost }
      )
    )
    .toFixture();

  const { alicesComments } = await execute(scenario);

  // Upvote the first comment twice.
  alicesComments[0].upvote();
  alicesComments[0].upvote();

  const actual = getMostUpvotedComment(alicesComments);

  expect(actual).toBe(alicesComments[0]);
});
```

Let's recap what we've done to our test.

We **combined** our previously created fixtures into a new fixture `scenario`. This is the input data we are testing against:

- A user Bob with one post
- A user Alice who made 10 comments on Bob's post

It's actually the same data set as the first test. The difference between this and the previous test is that we are only specifing the relationships which we are interested in.

Notice how our test got a lot less cluttered with setting up all this random data. As a bonus the fixtures we created are also re-usable for any other test.

Find out more about what you can do with fixtures such as:

- [Supplying arguments](./supplying-arguments.md)
- [Making lists](./making-lists.md)
- [Accessing context](./context.md)
- [Combining fixtures](./combining-fixtures.md)
