/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import { Fixture } from "./fixture";
import { isDefined, MaybePromise } from "./utils";

export type Executor<T = any, TContext = any> = (
  fixture: Fixture<T>,
  context?: TContext
) => Promise<T>;

export type ExecutorMiddlewareFn = (
  fixture: Fixture<any>,
  next: Executor
) => Promise<any>;

export type PluginFn<TConfig = any> = (
  config?: Partial<TConfig>
) => {
  name: string;
  version: string;
  onCreateExecutor?: () => ExecutorMiddlewareFn;
  onBefore?: () => MaybePromise<void>;
  onAfter?: () => MaybePromise<void>;
};

export type Plugin = ReturnType<PluginFn>;

export function isExecutorMiddlewareFn(
  value: any
): value is ExecutorMiddlewareFn {
  return !_.isNil(value) && _.isFunction(value);
}

export function composePluginExecutorMiddlewares<T>(
  plugins: Plugin[],
  executor: Executor<T>
) {
  let lastExecutor: Executor<any> = executor;
  for (const plugin of plugins.reverse()) {
    if (
      _.isNil(plugin.onCreateExecutor) ||
      !_.isFunction(plugin.onCreateExecutor)
    ) {
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
        if (isDefined(ctx)) {
          if (!_.isObject(ctx)) {
            throw new Error(
              "An unexpected error occured while executing fixture combination: " +
                `A plugin (${plugin.name}) has passed in an invalid context object.`
            );
          }

          previousContext[plugin.name] = ctx;
        }

        return previousNext(fixture, previousContext);
      });
    };
  }
  return lastExecutor as Executor<T>;
}

export function composePluginBeforeHooks(plugins: Plugin[]) {
  return async () => {
    for (const plugin of plugins) {
      if (_.isNil(plugin.onBefore) || !_.isFunction(plugin.onBefore)) {
        continue;
      }
      await plugin.onBefore();
    }
  };
}

export function composePluginAfterHooks(plugins: Plugin[]) {
  return async () => {
    for (const plugin of plugins) {
      if (_.isNil(plugin.onAfter) || !_.isFunction(plugin.onAfter)) {
        continue;
      }
      await plugin.onAfter();
    }
  };
}
