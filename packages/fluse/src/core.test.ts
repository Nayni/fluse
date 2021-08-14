import faker from "faker";
import { fluse } from "./core";
import { createPlugin, EmptyContext, EmptyOptions } from "./plugin";

describe("single fixtures", () => {
  const { fixture } = fluse();

  const userFixture = fixture<User>({
    create() {
      return {
        id: "1",
        username: "Bob",
      };
    },
  });

  const postFixture = fixture<Post, { author: User }>({
    create(ctx, { author }) {
      return {
        id: faker.datatype.uuid(),
        title: faker.lorem.words(10),
        author,
      };
    },
  });

  it("should be executable", async () => {
    const actual = await userFixture().execute();

    expect(actual.id).toBe("1");
    expect(actual.username).toBe("Bob");
  });

  it("should be possible to create lists of the fixture", async () => {
    const actual = await userFixture().list(5).execute();

    expect(actual).toHaveLength(5);
  });

  it("should allow fixtures as arguments", async () => {
    const actual = await postFixture({ author: userFixture() }).execute();

    expect(actual.author.id).toBe("1");
  });
});

describe("scenarios", () => {
  const { fixture, scenario } = fluse();

  const userFixture = fixture<User, { username: string }>({
    create(ctx, { username }) {
      return {
        id: faker.datatype.uuid(),
        username,
      };
    },
  });

  const postFixture = fixture<Post, { author: User }>({
    create(ctx, { author }) {
      return {
        id: faker.datatype.uuid(),
        title: faker.lorem.words(10),
        author,
      };
    },
  });

  it("should compose a complex scenario into a single executable fixture", async () => {
    // This test also verifies if TypeScript is inferring all the types correctly and picking the right overload of 'with()'.
    const actual = await scenario()
      // simple fixture
      .with("bob", userFixture({ username: "Bob" }))
      // array of fixtures
      .with(
        "users",
        ["Dave", "Alice"].map((username) => userFixture({ username }))
      )
      // factory using inputs from previous results in the chain
      .with("bobsPost", ({ bob }) => postFixture({ author: bob }))
      // factory returning a list of fixtures
      .with("usersPosts", ({ users }) =>
        users.map((user) => postFixture({ author: user }))
      )
      .compose()
      .execute();

    expect(actual.bob.username).toBe("Bob");
    expect(actual.users).toHaveLength(2);
    expect(actual.users[0].username).toBe("Dave");
    expect(actual.users[1].username).toBe("Alice");
    expect(actual.bobsPost.author).toEqual(actual.bob);
    expect(actual.usersPosts).toHaveLength(2);
    expect(actual.usersPosts[0].author).toEqual(actual.users[0]);
    expect(actual.usersPosts[1].author).toEqual(actual.users[1]);
  });

  it("should throw when a duplicate name used during composition", async () => {
    // This test is actually more for coverage and to see if non-ts users get a runtime error.
    // We type check this so we have to cheat the type system by casting it away.
    expect(() =>
      scenario()
        .with("bob", userFixture({ username: "Bob" }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .with("bob" as any, userFixture({ username: "Bob" }))
    ).toThrow(/The name (.*) already exists in your scenario/);
  });

  it("throw when an unknown fixture instance is used during execution ", async () => {
    await expect(() =>
      scenario()
        .with("bob", {
          execute: jest.fn(),
          list: jest.fn(),
        })
        .compose()
        .execute()
    ).rejects.toThrow(
      /The arguments for (.*) resulted in an unknown fixture format/
    );
  });
});

describe("usage with plugins", () => {
  const pluginOne = createPlugin<PluginOneContext, PluginOneOptions>({
    name: "pluginOne",
    version: "*",
    execute(next) {
      return next({ foo: "bar" });
    },
  });

  const pluginTwo = createPlugin<EmptyContext, EmptyOptions>({
    name: "pluginTwo",
    version: "*",
    execute(next) {
      return next();
    },
  });

  const { fixture } = fluse({
    plugins: {
      one: pluginOne,
      two: pluginTwo,
    },
  });

  const userFixture = fixture<User>({
    create(ctx) {
      return {
        id: "1",
        username: ctx.one.foo,
      };
    },
  });

  it("should be possible to access context values from plugins", async () => {
    const actual = await userFixture().execute();

    expect(actual.id).toBe("1");
    expect(actual.username).toBe("bar");
  });

  it("should run plugins in the order as they were addeed in the plugin config map", async () => {
    const order: number[] = [];
    pluginOne.execute = (next) => {
      order.push(1);
      return next({
        foo: "bar",
      });
    };
    pluginTwo.execute = (next) => {
      order.push(2);
      return next();
    };

    const actual = await userFixture().execute();

    expect(actual.username).toBe("bar");
    expect(order).toEqual([1, 2]);
  });

  it("be possible to provide plugin options at execution time", async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const pluginOneExecuteMock = jest.fn<
      Promise<any>,
      [(ctx: PluginOneContext) => Promise<any>, PluginOneOptions]
    >((next, options) => {
      return next({
        foo: options.hello,
      });
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
    pluginOne.execute = pluginOneExecuteMock;

    const actual = await userFixture().execute({ one: { hello: "world" } });

    expect(actual.username).toBe("world");
    expect(pluginOneExecuteMock.mock.calls[0][1].hello).toBe("world");
  });
});

interface PluginOneContext {
  foo: string;
}

interface PluginOneOptions {
  hello: string;
}

interface User {
  id: string;
  username: string;
}

interface Post {
  id: string;
  title: string;
  author: User;
}
