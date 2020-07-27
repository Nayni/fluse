/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import { FixtureContext } from ".";
import { MaybePromise, StrictlyRecord } from "./utils";

/**
 * Defines the function signature of the fixture's create method.
 */
type FixtureCreateFn<TResult, TArgs> = (
  context: FixtureContext,
  args: TArgs
) => MaybePromise<TResult>;

/**
 * A fixture's configuration.
 */
type FixtureOptions<TResult, TArgs> = {
  /**
   * The create method of a fixture.
   * This function will be called internally by 'execute()' to create the desired data.
   */
  create: FixtureCreateFn<TResult, TArgs>;
};

/**
 * Defines a fixture created by the 'fixture()' api.
 */
export type Fixture<T> = {
  /** Creates the fixture data. */
  create: (context: FixtureContext) => Promise<StrictlyRecord<T>>;
};

/**
 * Creator fnction returning an instance of a Fixture, takes in previously created fixtures in the chain.
 */
type FixtureFn<TResult, TFixtures> = (fixtures: TFixtures) => Fixture<TResult>;

/** Internal definition of a fixture's result. */
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

/**
 * Defines a fixture usable by 'execute()' and 'combine()'.
 * @param config The fixture configuration.
 */
export function fixture<TResult, TArgs = false>(
  config: FixtureOptions<TResult, TArgs>
): FixtureFactory<TResult, TArgs> {
  return function fixtureFactory<TName extends string>(
    name: TName,
    args: TArgs
  ) {
    const create = async (context: FixtureContext) => {
      const result = await Promise.resolve(config.create(context, args));

      return {
        [name]: result,
      };
    };

    return { create };
  } as any;
}

/**
 * Checks whether value is a fixture.
 */
export function isFixture(value: any): value is Fixture<any> {
  return (
    _.isObject(value) &&
    value.hasOwnProperty("create") &&
    _.isFunction((value as any).create)
  );
}

/**
 * Builder API to create a combined fixture using multiple single fixtures.
 */
export class CombinedFixtureBuilder<TFixtures extends {} = {}> {
  constructor(private fixtureFns: FixtureFn<any, any>[] = []) {}

  /**
   * Adds a single fixture to the combined result.
   * @param fixture The fixture to add to the combined result.
   */
  and<TResult>(
    fixture: Fixture<TResult>
  ): CombinedFixtureBuilder<TFixtures & TResult>;

  /**
   * Adds a fixture function to the combined result.
   * Useful to pass output from previouso fixtures of the chain as input of the next fixture.
   * @param fixtureFn The function creating a fixture.
   */
  and<TResult>(
    fixtureFn: FixtureFn<TResult, TFixtures>
  ): CombinedFixtureBuilder<TFixtures & TResult>;

  and<TResult>(
    fixtureOrFixtureFn: Fixture<TResult> | FixtureFn<TResult, TFixtures>
  ): CombinedFixtureBuilder<TFixtures & TResult> {
    return new CombinedFixtureBuilder<TFixtures & TResult>([
      ...this.fixtureFns,
      _.isFunction(fixtureOrFixtureFn)
        ? fixtureOrFixtureFn
        : () => fixtureOrFixtureFn,
    ]);
  }

  /**
   * Creates a new single fixture of the combined result, can be consumed by 'execute()'.
   */
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
                "\n\nA valid fixture is created by 'fixture()' or 'combine()'."
            );
          }

          const result = await fixture.create(context);

          if (_.isNil(result)) {
            continue;
          }

          if (!_.isPlainObject(result)) {
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

/**
 * Combine a series of fixtures into a single new fixture.
 * Use the 'and()' method to chain multiple fixtures.
 */
export function combine() {
  return new CombinedFixtureBuilder();
}
