---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Fluse is a database seeder. It focusses on giving you a **fluent** and **extensible** api to build up **data fixtures** which you can use to seed any underlying database either via the CLI or in code.

### Why Fluse?

Building re-usable and quality data fixtures is hard.

The majority of logic in an average application resolves around manipulating data in a specific state, testing a piece of code that operates on a data model in a specific state quickly is very valuable. However as your domain model grows managing all these data sets becomes harder and harder.

Many projects already leverage existing tools such as ORM's or Query Builders to define and interact with their data models. While these tools give you a great database abstraction they usually fall short when it comes to managing data fixtures.

This is where Fluse comes in. Fluse allows you to build up small and re-usable data fixture blocks in a fluent, extensible and type-safe way.

### How does Fluse work?

Fluse consists of the following parts:

- `fluse`: The core providing you with building blocks for data fixtures and a database seeder to execute them.
- `fluse-cli`: A CLI to interact with Fluse from the command line.
- `fluse-plugins`: A set of extensions to Fluse allowing you to connect Fluse to your favorite library, take a look at our official plugins!

#### Fixtures

A major building block of Fluse is a `fixture`.

A `fixture` is the smallest piece to create re-usable data sets to seed into your database. Defining a `fixture` is very simple:

```typescript
import { fixture } from "fluse";
import { User } from "./entities/User";

const userFixture = fixture({
  async create(ctx) {
    const user = new User({ username: "fluse" });
    return ctx.db.save(user);
  },
});
```

A `fixture` requires you to implement a single method: `create`. The `create` function of your `fixture` is responsible for one thing: create a data object and store it into the database of your choice. You receive access to your database connection by getting it from the `context` object passed in.

Find out more about what you can do with fixtures in our [Fixture section]() such as:

- [Supplying arguments]()
- [Combining fixtures]()
- [The remove method]()

#### Seeder

Once you have defined your fixture(s) you'll want to execute them against your database by using the `Seeder`.

The `Seeder` is responsible for creating (or deleting) a fixture into your database. Using the example above this would look something like this:

```typescript
const seeder = new Seeder({
  fixture: userFixture("user"),
  plugins: [databasePlugin()],
});

const fixtures = await seeder.seed();
// fixtures.user.username === "fluse";
```

A `Seeder` takes a fixture and an optional set of plugins to execute your fixture against the underlying database. You can create your fixture by calling `seed()`.

In order for the `userFixture` to be used by the `Seeder` you have to invoke it with a name. This name is used to give you back the data that was created on a key of the result by calling `seed()`. The benefits the name becomes more apparant when you start [combining multiple fixtures]().

In addition to a fixture you can also specify a list of plugins to use. Plugins are a way to give Fluse access to your database of choice and use whatever library you wish for database access. Read more about plugins and their usage in our [plugin section]()

You can find a more in-depth look into the `Seeder` API in the [Seeder section]()

### Why does Fluse return me the created fixtures?

When you seed your fixtures into the databse Fluse will return you the exact data set that was just created. It knows the structure of this data set by using the type information of all your individual fixtures and the names you have given them.

One of the biggest problems with testing your logic against random data is that... well it's random! By returning you the exact data set that was just created you now have to power to assert your logic against possible outputs, even though your input might contain randomized data.

Given the following logic:

```typescript
export class User {
  constructor(public username: string) {}
}

export class UserService {
  getWelcomemMessage(id: number) {
    const user = this.repository.findOne(id);
    return `Welcome ${user.username}!`;
  }
}
```

We can now test our API against this, even though a username might be randomly generated.

```typescript
const randomUserFixture = fixture({
  async create(ctx) {
    const user = new User(faker.internet.userName());
    return ctx.repository.save(user);
  },
});
```

```typescript
// src/UserService.test.ts
describe("getWelcomemMessage", () => {
  it("should contain the user's username", async () => {
    // Arrange
    const seeder = new Seeder({
      fixture: randomUserFixture("user"),
      plugins: [databasePlugin()],
    });

    const fixtures = await seeder.seed();

    // Act
    const userService = new UserService();
    const message = await userService.getWelcomemMessage(fixtures.user.id);

    // Assert
    expect(message).toContain(fixtures.user.username);
  });
});
```

Tests like the one above is what is called a [Black-box test](https://en.wikipedia.org/wiki/Black-box_testing). It doesn't try to asset on which internal methods are being called instead it focusses on functionality that is expected by looking at the output.

Writing Black-box tests with Fluse becomes incredibly easy because you always have access to the input data set as well as your logic that is operating on this data.
