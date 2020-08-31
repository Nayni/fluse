/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import { FixtureContext } from ".";
import { Args, MaybePromise, RequiredKeys, StrictlyRecord } from "./utils";

export interface FixtureCreatorInfo {
  list: {
    index: number;
    size: number;
  };
}

type FixtureCreator<TResult, TArgs> = (
  context: FixtureContext,
  args: TArgs,
  info: FixtureCreatorInfo
) => MaybePromise<TResult>;

interface FixtureDefinition<TResult, TArgs> {
  create: FixtureCreator<TResult, TArgs>;
}

type FixtureFactoryOptions<TArgs> = Args<TArgs> & {
  list?: number | false;
};

type HasList<TOptions> = TOptions extends { list: number } ? true : false;

export interface Fixture<T> {
  create: (context: FixtureContext) => Promise<StrictlyRecord<T>>;
}

type FixtureFactory<TResult, TArgs> = RequiredKeys<TArgs> extends never
  ? TResult extends void
    ? (options?: FixtureFactoryOptions<TArgs>) => Fixture<void>
    : <TName extends string, TOptions extends FixtureFactoryOptions<TArgs>>(
        name: TName,
        options?: TOptions
      ) => Fixture<
        {
          [K in TName]: HasList<TOptions> extends true ? TResult[] : TResult;
        }
      >
  : TResult extends void
  ? (options: FixtureFactoryOptions<TArgs>) => Fixture<void>
  : <TName extends string, TOptions extends FixtureFactoryOptions<TArgs>>(
      name: TName,
      options: TOptions
    ) => Fixture<
      {
        [K in TName]: HasList<TOptions> extends true ? TResult[] : TResult;
      }
    >;

type FixtureFn<TResult, TFixtures> = (fixtures: TFixtures) => Fixture<TResult>;

/**
 * Defines a fixture usable by 'execute()' and 'combine()'.
 * @param definition The fixture definition.
 */
export function fixture<TResult, TArgs>(
  definition: FixtureDefinition<TResult, TArgs>
): FixtureFactory<TResult, TArgs> {
  return function fixtureFactory<
    TName extends string,
    TOptions extends FixtureFactoryOptions<TArgs>
  >(name: TName, options?: TOptions) {
    if (_.isNil(name)) {
      throw new Error(
        "An error occured trying to consume a fixture: " +
          "A fixture must have a name, make sure you've specified a name as the first argument."
      );
    }

    if (!_.isNil(options) && !_.isNil(options.list)) {
      if (options.list <= 0) {
        throw new Error(
          "An error occured trying to consume a fixture: " +
            "The list option must be a number greater than 0 or 'false'."
        );
      }
    }

    const create = async (context: FixtureContext) => {
      const results = await Promise.all(
        Array(options?.list || 1)
          .fill(0)
          .map((__, index) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            definition.create(
              context,
              _.defaultTo(options?.args, {} as TArgs),
              {
                list: { index: index, size: options?.list || 1 },
              }
            )
          )
      );

      return {
        [name]: options?.list ? results : results[0],
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
// eslint-disable-next-line @typescript-eslint/ban-types
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
