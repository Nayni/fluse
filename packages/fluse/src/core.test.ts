/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fluse } from "./core";
import { CombinedFixtureBuilder, Fixture } from "./fixture";
import { createPlugin, EmptyContext, PluginMiddlewareNextFn } from "./plugin";

describe("'execute()'", () => {
  it("should throw when an invalid fixture is provided", async () => {
    const { execute } = fluse();

    await expect(() =>
      execute((null as unknown) as Fixture<unknown, unknown>)
    ).rejects.toThrowError(/The provided fixture is not valid/);
  });

  it("should resolve the provided fixture", async () => {
    const { execute, fixture } = fluse();
    const testFixture = fixture({
      create() {
        return { foo: "bar" };
      },
    });

    const actual = await execute(testFixture("test"));

    expect(actual.test.foo).toBe("bar");
  });

  it("should use the provided plugins", async () => {
    const pluginOneExecute = jest.fn<
      any,
      [PluginMiddlewareNextFn<{ one: string }>]
    >((next) =>
      next({
        one: "1",
      })
    );
    const pluginTwoExecute = jest.fn<
      any,
      [PluginMiddlewareNextFn<{ two: string }>]
    >((next) =>
      next({
        two: "2",
      })
    );
    const plugin = createPlugin({
      name: "one",
      version: "*",
      execute: pluginOneExecute,
    });
    const pluginTwo = createPlugin({
      name: "two",
      version: "*",
      execute: pluginTwoExecute,
    });
    const pluginThree = createPlugin<EmptyContext, { threeOptions: string }>({
      name: "three",
      version: "*",
      execute(next) {
        return next();
      },
    });
    const { execute, fixture } = fluse({
      plugins: {
        foo: plugin,
        bar: pluginTwo,
        baz: pluginThree,
      },
    });
    const testFixture = fixture({
      create() {
        return { foo: "bar" };
      },
    });

    const actual = await execute(testFixture("test"), {
      baz: {
        threeOptions: "configure me",
      },
    });

    expect(actual).toBeDefined();
    expect(pluginOneExecute).toHaveBeenCalled();
    expect(pluginTwoExecute).toHaveBeenCalled();
  });
});

describe("'combine()'", () => {
  it("should return a CombinedFixtureBuilder", () => {
    const { combine } = fluse();

    const actual = combine();

    expect(actual).toBeInstanceOf(CombinedFixtureBuilder);
  });
});
