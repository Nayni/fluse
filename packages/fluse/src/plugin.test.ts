/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import semver from "semver";
import { Fixture } from "./fixture";
import {
  composeMiddlewares,
  createPlugin,
  EmptyContext,
  validatePlugins,
} from "./plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

describe("'createPlugin()'", () => {
  it("create a valid plugin", () => {
    const actual = createPlugin<EmptyContext>({
      name: "foo",
      version: "*",
      execute(next) {
        return next();
      },
    });

    expect(actual.name).toBe("foo");
    expect(actual.version).toBe("*");
    expect(typeof actual.execute).toBe("function");
  });
});

describe("'validatePlugins()'", () => {
  it("should succeed when the plugin's version is compatible", () => {
    const plugin = createPlugin<EmptyContext>({
      name: "foo",
      version: "*",
      execute(next) {
        return next();
      },
    });

    validatePlugins({
      foo: plugin,
    });
  });

  it("should throw when the plugin's version is not compatible", () => {
    const plugin = createPlugin<EmptyContext>({
      name: "foo",
      version: semver.inc(packageJson.version, "major") as string,
      execute(next) {
        return next();
      },
    });

    expect(() =>
      validatePlugins({
        foo: plugin,
      })
    ).toThrowError(/is not compatible/);
  });
});

describe("'composeMiddlewares()'", () => {
  it("should compose plugins in a FIFO order of execution", async () => {
    const order: number[] = [];

    const pluginOne = createPlugin<EmptyContext>({
      name: "one",
      version: "*",
      execute(next) {
        order.push(1);
        return next();
      },
    });
    const pluginTwo = createPlugin<EmptyContext>({
      name: "two",
      version: "*",
      execute(next) {
        order.push(2);
        return next();
      },
    });
    const testFixture: Fixture<{}, { foo: number }> = {
      create: jest.fn(),
    };
    const resolve = composeMiddlewares<{}>(
      {
        one: pluginOne,
        two: pluginTwo,
      },
      {},
      (context) => testFixture.create(context)
    );

    await resolve({});

    expect(order).toEqual([1, 2]);
  });
});
