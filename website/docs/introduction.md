---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Fluse is a fixture builder. It provides you with a **fluent** and **extensible** api to build up **data fixtures**.

## Why Fluse?

As applications grow in complexity the data sets required to test a specific use-case of your business logic will too.

Maintaining a healthy set of data fixtures used for testing can be challenging.

Certain database tools such popular ORM's regularly provide you with a means to seed data into a database as means of providing initial data. These solutions however start to show their shortcommings when you extend data fixtures to your tests.

Fluse tries to provide you with simple yet powerful api to build up data fixtures and optionally seed them to your database of choice.

The focus of Fluse is **not** to be a database seeding solution, it's primary goal is to help you in building and maintaining a healthy set of data fixtures to test your business logic. However Fluse does provide plugins to interact with your database or ORM of choice.

## What is Fluse?

Fluse consists of the following parts:

- `fluse`: The core providing you with building blocks to compose your data fixtures and execute them.
- `fluse-plugins`: A set of extensions to Fluse allowing you to connect Fluse to your favorite library, take a look at our official plugins!
- `fluse-cli`: A CLI to interact with Fluse from the command line.

## What is a fixture?

A fixture (or data fixture) is a function that knows how to create a certain type of object within your system.

This might sound a little vague so let's give you an example!

If you are building an application that interacts with users you might have a `User` object to represent such a user. Creating a user can be simple at first:

```typescript
const user = new User({ username: "Bob" });
```

But the system grows and the `User` class starts to hold more state than just the username. The `activated` state gets introduced and the application will behave differently based on this state. Getting to this new `activated` state takes just a couple of steps...

```typescript
const user = new User({ username: "Alice" });
user.performBackgroundCheck();
user.validateVerificationCode("abc");
user.confirmSMSCode("123");
// 25 more steps to take...
user.performFinalStep();
user.activated; // true
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

As the above shows, the test becomes cluttered with just creating the input for the test. This is irrelevant for the actual test, it doesn't care how this user got to this state, it only cares that it is.

With Fluse you define a **fixture** to create such a user **once**:

```typescript
// src/fixtures/users.ts
import { fixture } from "fluse";
import { User } from "./entities/User";

type Args = {
  username: string;
};

export const activatedUserFixture = fixture({
  async create(ctx, args: Args) {
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
import { execute } from "fluse";
import { activatedUserFixture } from "./fixtures/users";

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

Notice how the test got de-cluttered from all the setup code. We can focus on the thing we are testing and not the input we need.

As a bonus the fixture is also re-usable for any other test that might need an activated user.

> You might have noticed the `"userBob"` as first argument to `activatedUserFixture`. This is a requirement by Fluse and is a unique name for the created fixture. The advantages of this name will become clear when you start [combining fixtures]().

Find out more about what you can do with fixtures in our [Fixture section]() such as:

- [Supplying arguments]()
- [Accessing context]()
- [Combining fixtures]()
