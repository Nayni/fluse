/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import { FluseTypes, isFluseType, withFluseSymbol } from "./internal";
import {
  Args,
  isDefined,
  keysOf,
  MaybePromise,
  RequiredKeys,
  StrictlyRecord,
} from "./utils";

export interface FixtureCreatorInfo {
  list: {
    index: number;
    size: number;
  };
}

export type FixtureCreator<TContext, TResult, TArgs> = (
  context: TContext,
  args: TArgs,
  info: FixtureCreatorInfo
) => MaybePromise<TResult>;

export interface FixtureDefinition<TContext, TResult, TArgs> {
  create: FixtureCreator<TContext, TResult, TArgs>;
}

export type FixtureFactoryOptions<TArgs> = Args<TArgs> & {
  list?: number | false;
};

export type HasList<TOptions> = TOptions extends { list: number }
  ? true
  : false;

export interface FixtureFactoryWithOptionalArgs<TContext, TResult, TArgs> {
  <TName extends string, TOptions extends FixtureFactoryOptions<TArgs>>(
    name: TName,
    options?: TOptions
  ): Fixture<
    TContext,
    {
      [K in TName]: HasList<TOptions> extends true ? TResult[] : TResult;
    }
  >;

  asArg<TOptions extends FixtureFactoryOptions<TArgs>>(
    options?: TOptions
  ): HasList<TOptions> extends true ? TResult[] : TResult;
}

export interface FixtureFactoryWithRequiredArgs<TContext, TResult, TArgs> {
  <TName extends string, TOptions extends FixtureFactoryOptions<TArgs>>(
    name: TName,
    options: TOptions
  ): Fixture<
    TContext,
    {
      [K in TName]: HasList<TOptions> extends true ? TResult[] : TResult;
    }
  >;

  asArg<TOptions extends FixtureFactoryOptions<TArgs>>(
    options: TOptions
  ): HasList<TOptions> extends true ? TResult[] : TResult;
}

export interface Fixture<TContext, TResult> {
  create: (context: TContext) => Promise<StrictlyRecord<TResult>>;
}

export type FixtureFactory<TContext, TResult, TArgs> = RequiredKeys<
  TArgs
> extends never
  ? FixtureFactoryWithOptionalArgs<TContext, TResult, TArgs>
  : FixtureFactoryWithRequiredArgs<TContext, TResult, TArgs>;

export type FixtureFn<TContext, TResult, TFixtures> = (
  fixtures: TFixtures
) => Fixture<TContext, TResult>;

export function fixture<TContext, TResult = any, TArgs = unknown>(
  definition: FixtureDefinition<TContext, TResult, TArgs>
): FixtureFactory<TContext, TResult, TArgs> {
  function fixtureFactory<
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

    const fixture = {
      create: async (context: TContext) => {
        const results: TResult[] = [];
        const size = options?.list || 1;

        for (let i = 0; i < size; i++) {
          const args = await unwrapArgs(
            _.defaultTo(options?.args, {} as TArgs),
            context
          );
          const result = await definition.create(context, args, {
            list: { index: i, size },
          });

          results.push(result);
        }

        return {
          [name]: options?.list ? results : results[0],
        };
      },
    };

    withFluseSymbol(fixture, FluseTypes.Fixture);

    return fixture;
  }

  fixtureFactory.asArg = function <
    TOptions extends FixtureFactoryOptions<TArgs>
  >(options?: TOptions) {
    function fixtureAsArg(name: string) {
      return fixtureFactory(name, options);
    }

    withFluseSymbol(fixtureAsArg, FluseTypes.AsArg);

    return fixtureAsArg;
  };

  withFluseSymbol(fixtureFactory, FluseTypes.FixtureFactory);

  return (fixtureFactory as unknown) as FixtureFactory<
    TContext,
    TResult,
    TArgs
  >;
}

export function isFixture(value: any): value is Fixture<any, any> {
  return isDefined(value) && isFluseType(value, FluseTypes.Fixture);
}

export async function unwrapArgs<TContext, TArgs>(
  args: TArgs,
  context: TContext
) {
  const unwrappedArgs: Record<any, any> = {};

  for (const argKey of keysOf(args)) {
    const arg = args[argKey];

    if (_.isFunction(arg) && isFluseType(arg, FluseTypes.AsArg)) {
      const unwrappedArg = await arg(argKey).create(context);
      unwrappedArgs[argKey] = unwrappedArg[argKey];
    } else {
      unwrappedArgs[argKey] = arg;
    }
  }

  return unwrappedArgs as TArgs;
}

/**
 * Builder API to create a combined fixture using multiple single fixtures.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class CombinedFixtureBuilder<TContext, TFixtures extends {} = {}> {
  constructor(private fixtureFns: FixtureFn<TContext, any, any>[] = []) {}

  /**
   * Adds a single fixture to the combined result.
   * @param fixture The fixture to add to the combined result.
   */
  and<TResult>(
    fixture: Fixture<TContext, TResult>
  ): CombinedFixtureBuilder<TContext, TFixtures & TResult>;

  /**
   * Adds a fixture function to the combined result.
   * Useful to pass output from previouso fixtures of the chain as input of the next fixture.
   * @param fixtureFn The function creating a fixture.
   */
  and<TResult>(
    fixtureFn: FixtureFn<TContext, TResult, TFixtures>
  ): CombinedFixtureBuilder<TContext, TFixtures & TResult>;

  and<TResult>(
    fixtureOrFixtureFn:
      | Fixture<TContext, TResult>
      | FixtureFn<TContext, TResult, TFixtures>
  ): CombinedFixtureBuilder<TContext, TFixtures & TResult> {
    return new CombinedFixtureBuilder<TContext, TFixtures & TResult>([
      ...this.fixtureFns,
      _.isFunction(fixtureOrFixtureFn)
        ? fixtureOrFixtureFn
        : () => fixtureOrFixtureFn,
    ]);
  }

  /**
   * Creates a new single fixture of the combined result, can be consumed by 'execute()'.
   */
  toFixture(): Fixture<TContext, TFixtures> {
    const fixture = {
      create: async (context: TContext) => {
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

    withFluseSymbol(fixture, FluseTypes.Fixture);

    return fixture;
  }
}
