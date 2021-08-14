import _ from "lodash";
import { Fixture, FluseFixture, isFluseFixture } from "./fixture";
import { FluseTypes, withFluseSymbol } from "./internal";
import { PluginConfig } from "./plugin";

export type FixtureFactory<TRuntimeOptions, TResult, TInput> = (
  input: TInput
) => Fixture<TResult, TRuntimeOptions>;

export type MultiFixtureFactory<TRuntimeOptions, TResult, TInput> = (
  input: TInput
) => Fixture<TResult, TRuntimeOptions>[];

export interface NamedFixtureFactory<TRuntimeOptions, TResult, TInput> {
  name: string;
  create: FixtureFactory<TRuntimeOptions, TResult, TInput>;
}

export class FluseScenarioComposer<
  TContext,
  TRuntimeOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TScenario extends Record<string, unknown> = {}
> {
  constructor(
    protected plugins: PluginConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private factories: NamedFixtureFactory<TRuntimeOptions, any, any>[] = []
  ) {
    this.with.bind(this);
    this.compose.bind(this);
  }

  with<TName extends string, TResult>(
    name: Exclude<TName, keyof TScenario>,
    fixture: Fixture<TResult, TRuntimeOptions>
  ): FluseScenarioComposer<
    TContext,
    TRuntimeOptions,
    TScenario & { [K in TName]: TResult }
  >;

  with<TName extends string, TResult>(
    name: Exclude<TName, keyof TScenario>,
    fixtures: Fixture<TResult, TRuntimeOptions>[]
  ): FluseScenarioComposer<
    TContext,
    TRuntimeOptions,
    TScenario & { [K in TName]: TResult[] }
  >;

  with<TName extends string, TResult>(
    name: Exclude<TName, keyof TScenario>,
    factory: FixtureFactory<TRuntimeOptions, TResult, TScenario>
  ): FluseScenarioComposer<
    TContext,
    TRuntimeOptions,
    TScenario & { [K in TName]: TResult }
  >;

  with<TName extends string, TResult>(
    name: Exclude<TName, keyof TScenario>,
    multiFactory: MultiFixtureFactory<TRuntimeOptions, TResult, TScenario>
  ): FluseScenarioComposer<
    TContext,
    TRuntimeOptions,
    TScenario & { [K in TName]: TResult[] }
  >;

  with<TName extends string, TResult>(
    name: Exclude<TName, keyof TScenario>,
    factory:
      | Fixture<TResult, TRuntimeOptions>
      | Fixture<TResult, TRuntimeOptions>[]
      | FixtureFactory<TRuntimeOptions, TResult, TScenario>
      | MultiFixtureFactory<TRuntimeOptions, TResult, TScenario>
  ): FluseScenarioComposer<
    TContext,
    TRuntimeOptions,
    TScenario & { [K in TName]: TResult }
  > {
    this.validateNameExists(name);

    const wrappedFactory: FixtureFactory<
      TRuntimeOptions,
      { [K in TName]: TResult },
      TScenario
    > = (input) => {
      const wrappedFixture = new FluseFixture<
        TContext,
        { [K in TName]: TResult },
        never,
        TRuntimeOptions
      >(this.plugins, {
        create: async (context) => {
          const fixture = this.unwrapFactoryOrFixture(name, factory, input);
          const result = await fixture.resolve(context);
          return {
            [name]: result,
          } as { [K in TName]: TResult };
        },
      });

      withFluseSymbol(wrappedFixture, FluseTypes.Fixture);

      return wrappedFixture;
    };

    return new FluseScenarioComposer<
      TContext,
      TRuntimeOptions,
      TScenario & { [K in TName]: TResult }
    >(this.plugins, [...this.factories, { name, create: wrappedFactory }]);
  }

  compose(): Fixture<TScenario, TRuntimeOptions> {
    const fixture = new FluseFixture<
      TContext,
      TScenario,
      never,
      TRuntimeOptions
    >(this.plugins, {
      create: async (ctx) => {
        const scenario: Record<string, unknown> = {};

        for (const factory of this.factories) {
          const fixture = factory.create(scenario);

          if (!isFluseFixture(fixture)) {
            throw new Error(
              `An error occured trying to compose your scenario. One of your factories did not return a FluseFixture.`
            );
          }

          const result = await fixture.resolve(ctx);
          _.merge(scenario, result);
        }

        return scenario as TScenario;
      },
    });

    withFluseSymbol(fixture, FluseTypes.Fixture);

    return fixture;
  }

  async execute(options?: TRuntimeOptions): Promise<TScenario> {
    const fixture = this.compose();
    return await fixture.execute(options);
  }

  private validateNameExists(name: string) {
    if (this.factories.some((f) => f.name === name)) {
      throw new Error(
        `An error occured trying to compose your scenario. The name ${name} already exists in your scenario.`
      );
    }
  }

  private unwrapFactoryOrFixture<TResult>(
    name: string,
    value:
      | Fixture<TResult, TRuntimeOptions>
      | Fixture<TResult, TRuntimeOptions>[]
      | FixtureFactory<TRuntimeOptions, TResult, TScenario>
      | MultiFixtureFactory<TRuntimeOptions, TResult, TScenario>,
    input: TScenario
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): FluseFixture<any, any, any, any> {
    if (_.isFunction(value)) {
      return this.unwrapFixtureFactory(name, value, input);
    } else {
      return this.unwrapFixture(name, value);
    }
  }

  private unwrapFixture<TResult>(
    name: string,
    fixture:
      | Fixture<TResult, TRuntimeOptions>
      | Fixture<TResult, TRuntimeOptions>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): FluseFixture<any, any, any, any> {
    if (isFluseFixture(fixture)) {
      return fixture;
    } else if (isFluseFixtureArray(fixture)) {
      return this.unwrapFixtureArray(fixture);
    } else {
      throw new Error(
        `An error occured trying to compose your scenario. The arguments for ${name} resulted in an unknown fixture format.` +
          "\r\nPlease make sure you are using the provided fixture() function from Fluse to define your fixtures."
      );
    }
  }

  private unwrapFixtureFactory<TResult>(
    name: string,
    factory:
      | FixtureFactory<TRuntimeOptions, TResult, TScenario>
      | MultiFixtureFactory<TRuntimeOptions, TResult, TScenario>,
    input: TScenario
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): FluseFixture<any, any, any, any> {
    const fixture = factory(input);
    return this.unwrapFixture(name, fixture);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private unwrapFixtureArray(fixtures: FluseFixture<any, any, any, any>[]) {
    const fixture = new FluseFixture(this.plugins, {
      async create(ctx) {
        const results = [];
        for (const entry of fixtures) {
          const result = await entry.resolve(ctx);
          results.push(result);
        }

        return results;
      },
    });

    withFluseSymbol(fixture, FluseTypes.Fixture);

    return fixture;
  }
}

function isFluseFixtureArray(
  value: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): value is FluseFixture<any, any, any, any>[] {
  return Array.isArray(value) && value.every((v) => isFluseFixture(v));
}
