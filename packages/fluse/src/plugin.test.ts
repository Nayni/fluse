import semver from "semver";
import { createPlugin, EmptyContext, validatePlugins } from "./plugin";

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
