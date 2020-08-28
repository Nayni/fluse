---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

Fluse is a **fixture builder**. It enables you to build up fixtures in a **fluent** and **type-safe** way.

## Why Fluse?

Testing requires input data, as applications grow in complexity providing that input data becomes more and more complex for several reasons:

- data in the system become interconnected
- getting an data into a specific state for testing requires a (large) series of steps
- data might have to be seeded into a database because you are integration testing or tightly coupled to a database

Maintaining a healthy set of data fixtures for medium to large projects can be challenging. It requires a bunch of code just to create data. However this code isn't really part of the application, it's primary goal is to facilitate testing.

Popular ORM's today usually come with a solution to seed data into your database. These solutions however start to fall short when you start using them intensivly because:

- they are tied to the ORM solution and don't really work without a database
- they are usually implemented in the form of migrations and are not re-usable, type-safe and are hard to consume in test environments

Fluse is a tool specifically designed to help you in making **re-usable** and **type-safe** data fixtures. It allows you to define **small** and **composable** building blocks for creating test data.

Fluse doesn't tie itself to any ORM solution and works perfectly without any database.

## What is Fluse?

Fluse consists of the following parts:

- `fluse`: The core providing you with building blocks to compose your data fixtures and execute them.
- `fluse-plugins`: A set of extensions to Fluse allowing you to connect Fluse to your favorite library, take a look at our [official plugins](./plugin-typeorm.md)!

## What is a fixture?

A fixture is a function that knows how to create a certain type of data within your system.

This might sound a little vague so let's give you an example!

If you are building an application that interacts with users you will have some type of `User` object to represent such a user. Creating an instance of a user can be simple at first:

```typescript
const user = new User({ username: "Bob" });
```

But your system grows and the `User` object starts to hold more state than just the username.

For example a user might have an `activated` state. Your application will behave differently based on this state. Getting a user to the `activated` state _only_ takes a couple of steps...

```typescript
const user = new User({ username: "Alice" });
user.performBackgroundCheck();
user.validateVerificationCode("abc");
user.confirmSMSCode("123");
// 25 more steps to take...
user.performFinalStep();
user.isActivated(); // true
```

This means that writing a test where the input is an activated user you have to:

```typescript
describe("foo", () => {
  it("should return true for an activated user", () => {
    const user = new User({ username: "Alice" });
    user.performBackgroundCheck();
    user.validateVerificationCode("abc");
    user.confirmSMSCode("123");
    // 25 more steps to take...
    user.performFinalStep();

    const actual = fooService.doSomething(user);

    expect(actual).toBe(true);
  });
});
```

As the above shows, the test becomes cluttered with just creating the input for the test. The test itself however doesn't really care how this user got into this state, it only cares that it is in the `activated` state.

With Fluse you define a **fixture** to create such a user **once**:

```typescript
// src/fixtures/users.ts
import { fixture } from "fluse";
import { User } from "./entities/User";

type Args = {
  username: string;
};

export const activatedUserFixture = fixture({
  create(ctx, args: Args) {
    const user = new User({ username: args.username });
    user.performBackgroundCheck();
    user.validateVerificationCode("abc");
    user.confirmSMSCode("123");
    // 25 more steps to take...
    user.performFinalStep();
    return user;
  },
});
```

Writing the same test now becomes:

```typescript
// src/fooService.test.ts
import { createExecutor } from "fluse";
import { activatedUserFixture } from "./fixtures/users";

const execute = createExecutor();

describe("foo", () => {
  it("should return true for an activated user", async () => {
    const { userBob } = await execute(
      activatedUserFixture("userBob", { username: "Bob" })
    );
    const actual = fooService.doSomething(userBob);
    expect(actual).toBe(true);
  });
});
```

Notice how the test becomes a lot cleaner because we've moved all the setup code for an `activated` user into its own fixture. We can focus on the thing we are testing and not the input we need.

As a bonus the fixture is also re-usable for any other test that might need an activated user.

:::note
You might have noticed the `"userBob"` as a first argument to `activatedUserFixture`. This is a requirement by Fluse, it's a unique name for the created fixture. The advantages of this name will become clear when you start [combining fixtures](./combining-fixtures.md).
:::

Find out more about what you can do with fixtures such as:

- [Supplying arguments](./supplying-arguments.md)
- [Making lists](./making-lists.md)
- [Accessing context](./context.md)
- [Combining fixtures](./combining-fixtures.md)
