/* eslint-disable @typescript-eslint/no-explicit-any */

import isFunction from "lodash.isfunction";
import isNil from "lodash.isnil";
import isPlainObject from "lodash.isplainobject";
import { FixtureContext } from ".";
import { MaybePromise, StrictlyRecord } from "./utils";

type FixtureCreateFn<TResult, TArgs> = (
  context: FixtureContext,
  args: TArgs
) => MaybePromise<TResult>;

type FixtureOptions<TResult, TArgs> = {
  create: FixtureCreateFn<TResult, TArgs>;
};

export type Fixture<T> = {
  create: (context: FixtureContext) => Promise<StrictlyRecord<T>>;
};

type FixtureFn<TResult, TFixtures> = (fixtures: TFixtures) => Fixture<TResult>;

type FixtureResult<TName extends string, TResult> = { [K in TName]: TResult };

type FixtureFactoryWithoutArgs<TResult> = TResult extends void
  ? () => Fixture<{}>
  : <TName extends string>(
      name: TName
    ) => Fixture<FixtureResult<TName, TResult>>;

type FixtureFactoryWithArgs<TResult, TArgs> = TResult extends void
  ? (args: TArgs) => Fixture<{}>
  : <TName extends string>(
      name: TName,
      args: TArgs
    ) => Fixture<FixtureResult<TName, TResult>>;

type FixtureFactory<TResult, TArgs> = TArgs extends false
  ? FixtureFactoryWithoutArgs<TResult>
  : FixtureFactoryWithArgs<TResult, TArgs>;

export function fixture<TResult, TArgs = false>(
  config: FixtureOptions<TResult, TArgs>
): FixtureFactory<TResult, TArgs> {
  return function fixtureFactory<TName extends string>(
    name: TName,
    args: TArgs
  ) {
    return {
      async create(context: FixtureContext) {
        const result = await Promise.resolve(config.create(context, args));

        return {
          [name]: result,
        };
      },
    };
  } as any;
}

export function isFixture(value: any): value is Fixture<any> {
  return (
    !isNil(value) &&
    typeof value === "object" &&
    value.hasOwnProperty("create") &&
    typeof value.create === "function"
  );
}

export class CombinedFixtureBuilder<TFixtures extends {} = {}> {
  constructor(private fixtureFns: FixtureFn<any, any>[] = []) {}

  and<TResult>(
    fixture: Fixture<TResult>
  ): CombinedFixtureBuilder<TFixtures & TResult>;

  and<TResult>(
    fixtureFn: FixtureFn<TResult, TFixtures>
  ): CombinedFixtureBuilder<TFixtures & TResult>;

  and<TResult>(
    fixtureOrFixtureFn: Fixture<TResult> | FixtureFn<TResult, TFixtures>
  ): CombinedFixtureBuilder<TFixtures & TResult> {
    return new CombinedFixtureBuilder<TFixtures & TResult>([
      ...this.fixtureFns,
      isFunction(fixtureOrFixtureFn)
        ? fixtureOrFixtureFn
        : () => fixtureOrFixtureFn,
    ]);
  }

  toFixture(): Fixture<TFixtures> {
    return {
      create: async (context) => {
        const fixtures: Record<string, any> = {};
        for (const fixtureFn of this.fixtureFns) {
          const fixture = fixtureFn(fixtures);

          if (!isFixture(fixture)) {
            throw new Error(
              "An unexpected error occured while executing fixture combination: " +
                "A fixture function did not return a valid fixture." +
                "\n\nA valid fixture is a plain object with a 'create' method."
            );
          }

          const result = await fixture.create(context);

          if (isNil(result)) {
            continue;
          }

          if (!isPlainObject(result)) {
            throw new Error(
              "An unexpected error occured while executing fixture combination: " +
                "one of your fixtures did not return a plain object."
            );
          }

          Object.keys(result).forEach((key) => {
            if (fixtures[key]) {
              throw new Error(
                "An unexpected error occured while executing fixture combination: " +
                  ` a duplicate fixture name '${key}' was found.` +
                  "\nWhen chaining multiple fixtures ensure that you've chosen a unique name for each individual fixture."
              );
            }

            fixtures[key] = result[key];
          });
        }

        return fixtures as StrictlyRecord<TFixtures>;
      },
    };
  }
}

export function combine() {
  return new CombinedFixtureBuilder();
}