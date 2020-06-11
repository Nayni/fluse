/* eslint-disable @typescript-eslint/no-explicit-any */

import isFunction from "lodash.isfunction";
import isNil from "lodash.isnil";
import { Fixture } from "./fixture";

export type SeedExecutor<TContext = any> = (
  fixture: Fixture<any>,
  context: TContext
) => Promise<any>;

export type ExecutorMiddlewareFn = (
  fixture: Fixture<any>,
  next: SeedExecutor
) => Promise<any>;

export type Plugin<TConfig = any> = (
  config: TConfig
) => {
  name: string;
  version: string;
  onCreateExecutor?: () => ExecutorMiddlewareFn;
};

export type InitializedPlugin = ReturnType<Plugin>;

export function isExecutorMiddlewareFn(
  value: any
): value is ExecutorMiddlewareFn {
  return !isNil(value) && isFunction(value);
}

export async function composePluginExecutorMiddlewares(
  plugins: InitializedPlugin[],
  executor: SeedExecutor
) {
  let lastExecutor = executor;
  for (const plugin of plugins.reverse()) {
    if (isNil(plugin.onCreateExecutor)) {
      continue;
    }

    const middleware = plugin.onCreateExecutor();

    if (!isExecutorMiddlewareFn(middleware)) {
      continue;
    }

    const currentNext = middleware;
    const previousNext = lastExecutor;
    lastExecutor = (fixture, previousContext) => {
      // The idea here is that plugins create their own sub-context and pass it to the next function.
      // This allows plugins to execute and create their stuff in an isolated way.
      // We then aggregate all these sub-context's into a big context object that is passed to the final fixture creator.
      // All the sub-context's go on a key named after the plugin's name.
      // However I think this need improvements still...
      return currentNext(fixture, (fixture, ctx) => {
        previousContext[plugin.name] = ctx;
        return previousNext(fixture, previousContext);
      });
    };
  }
  return lastExecutor;
}
