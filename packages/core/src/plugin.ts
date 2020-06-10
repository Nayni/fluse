/* eslint-disable @typescript-eslint/no-explicit-any */

import isFunction from "lodash.isfunction";
import isNil from "lodash.isnil";
import { FixtureContext } from ".";
import { Fixture } from "./fixture";
import { MaybePromise } from "./utils";

export type SeedExecutor = (fixture: Fixture<any>) => Promise<any>;

export type SeedMiddlewareFn = (
  fixture: Fixture<any>,
  next: SeedExecutor
) => Promise<any>;

export interface Plugin {
  name: string;
  version: string;
  onInit?: () => MaybePromise<void>;
  onCreateContext?: () => MaybePromise<any>;
  onCreatSeedExecutor?: () => MaybePromise<SeedMiddlewareFn>;
}

export function isSeedMiddlewareFn(value: any): value is SeedMiddlewareFn {
  return !isNil(value) && isFunction(value);
}

export function composeSeedMiddlewareFns<T>(
  seedMiddlewareFns: SeedMiddlewareFn[],
  executor: SeedExecutor
) {
  let lastExecutor = executor;
  for (const middleware of seedMiddlewareFns.reverse()) {
    const currentNext = middleware;
    const previousNext = lastExecutor;
    lastExecutor = (fixture) => {
      return currentNext(fixture, previousNext);
    };
  }
  return lastExecutor;
}

export type TypeORMPluginConfig = {
  message?: string;
};

declare global {
  interface FluseFixtureContext extends FixtureContext {
    typeorm: {
      connectionName: string;
    };
  }
}

export const typeormPlugin = (config: TypeORMPluginConfig): Plugin => {
  return {
    version: "0.0.1",
    name: "typeorm",
    onCreateContext() {
      return {
        connectionName: "default",
      };
    },
    onCreatSeedExecutor() {
      return async (fixture, next) => {
        console.log(config.message);
        const result = await next(fixture);
        return result;
      };
    },
  };
};
