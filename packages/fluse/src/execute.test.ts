import semver from "semver";
import { FixtureContext } from ".";
import { createExecutor } from "./execute";
import { Fixture, fixture } from "./fixture";
import { PluginFn } from "./plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

describe("'createExecutor()'", () => {
  it("should throw when duplicate plugins are found", () => {
    const pluginOne: PluginFn<unknown> = () => ({
      name: "one",
      version: "*",
    });
    const duplicatePluginOne: PluginFn<unknown> = () => ({
      name: "one",
      version: "*",
    });

    expect(() =>
      createExecutor({ plugins: [pluginOne(), duplicatePluginOne()] })
    ).toThrowError(/Duplicate plugins found/);
  });

  it("should throw when the plugin's version is not compatible", () => {
    const plugin: PluginFn<unknown> = () => ({
      name: "one",
      version: semver.inc(packageJson.version, "major") as string,
    });

    expect(() => createExecutor({ plugins: [plugin()] })).toThrowError(
      /is not compatible/
    );
  });

  describe("'execute()'", () => {
    it("should throw when an invalid fixture is provided", async () => {
      const execute = createExecutor();

      await expect(() =>
        execute((null as unknown) as Fixture<unknown>)
      ).rejects.toThrowError(/The provided fixture is not valid/);
    });

    it("should run the 'onBefore' hooks before running the actual fixture", async () => {
      const order: number[] = [];
      const onBefore = jest.fn<void, []>(() => order.push(1));
      const plugin: PluginFn<unknown> = () => ({
        name: "one",
        version: "*",
        onBefore,
      });

      const fixtureCreate = jest.fn<number, [FixtureContext]>(() =>
        order.push(2)
      );
      const testFixture = fixture({
        create: fixtureCreate,
      });

      const execute = createExecutor({ plugins: [plugin()] });
      const actual = await execute(testFixture("test"));

      expect(actual).toBeDefined();
      expect(order).toEqual([1, 2]);
    });

    it("should run the 'onAfter' hooks after running the actual fixture", async () => {
      const order: number[] = [];
      const onAfter = jest.fn<void, []>(() => order.push(2));
      const plugin: PluginFn<unknown> = () => ({
        name: "one",
        version: "*",
        onAfter,
      });

      const fixtureCreate = jest.fn<number, [FixtureContext]>(() =>
        order.push(1)
      );
      const testFixture = fixture({
        create: fixtureCreate,
      });

      const execute = createExecutor({ plugins: [plugin()] });
      const actual = await execute(testFixture("test"));

      expect(actual).toBeDefined();
      expect(order).toEqual([1, 2]);
    });
  });
});
