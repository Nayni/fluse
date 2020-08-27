import { FixtureContext } from ".";
import { fixture } from "./fixture";
import {
  composePluginExecutorMiddlewares,
  ExecutorMiddlewareFn,
  PluginFn,
} from "./plugin";

describe("'composePluginExecutorMiddlewares()'", () => {
  it("should compose plugins in a FIFO order of execution", async () => {
    const order: number[] = [];
    const pluginOneExecutor = jest.fn<ExecutorMiddlewareFn, []>(
      () => (fixture, next) => {
        order.push(1);
        return next(fixture, {});
      }
    );
    const pluginOne: PluginFn<unknown> = () => ({
      name: "one",
      version: "*",
      onCreateExecutor: pluginOneExecutor,
    });

    const pluginTwoExecutor = jest.fn<ExecutorMiddlewareFn, []>(
      () => (fixture, next) => {
        order.push(2);
        return next(fixture, {});
      }
    );
    const pluginTwo: PluginFn<unknown> = () => ({
      name: "two",
      version: "*",
      onCreateExecutor: pluginTwoExecutor,
    });

    const fixtureCreate = jest.fn<number, [FixtureContext]>();
    const testFixture = fixture({
      create: fixtureCreate,
    });

    const execute = composePluginExecutorMiddlewares(
      [pluginOne(), pluginTwo()],
      (fixture, context) => fixture.create(context)
    );

    const actual = await execute(testFixture("test"), {});

    expect(actual).toBeDefined();
    expect(order).toEqual([1, 2]);
  });

  it("should compose into an executor that throws when a plugin passes an invalid context", async () => {
    const order: number[] = [];
    const pluginExecutor = jest.fn<ExecutorMiddlewareFn, []>(
      () => (fixture, next) => {
        order.push(1);
        return next(fixture, "iam-not-a-valid-context");
      }
    );
    const plugin: PluginFn<unknown> = () => ({
      name: "one",
      version: "*",
      onCreateExecutor: pluginExecutor,
    });

    const fixtureCreate = jest.fn<number, [FixtureContext]>();
    const testFixture = fixture({
      create: fixtureCreate,
    });

    const execute = composePluginExecutorMiddlewares(
      [plugin()],
      (fixture, context) => fixture.create(context)
    );

    await expect(
      async () => await execute(testFixture("test"), {})
    ).rejects.toThrowError(/invalid context/);
  });

  it("should compose into an executor that doesn't throw when a plugin doesn't pass a context", async () => {
    const plugin: PluginFn<unknown> = () => ({
      name: "one",
      version: "*",
      onCreateExecutor: () => (fixture, next) => next(fixture),
    });

    const fixtureCreate = jest.fn<number, [FixtureContext]>();
    const testFixture = fixture({
      create: fixtureCreate,
    });

    const execute = composePluginExecutorMiddlewares(
      [plugin()],
      (fixture, context) => fixture.create(context)
    );

    const actual = await execute(testFixture("test"), {});

    expect(actual).toBeDefined();
  });

  it("should deal with missing 'onCreateExecutor'", async () => {
    const plugin: PluginFn<unknown> = () => ({
      name: "one",
      version: "*",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onCreateExecutor: () => null as any,
    });

    const fixtureCreate = jest.fn<number, [FixtureContext]>();
    const testFixture = fixture({
      create: fixtureCreate,
    });

    const execute = composePluginExecutorMiddlewares(
      [plugin()],
      (fixture, context) => fixture.create(context)
    );

    const actual = await execute(testFixture("test"), {});

    expect(actual).toBeDefined();
  });
});
