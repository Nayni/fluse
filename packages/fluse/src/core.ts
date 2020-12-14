import {
  FixtureDefinition,
  FixtureDefinitionConfig,
  FluseFixture,
} from "./fixture";
import { FluseTypes, withFluseSymbol } from "./internal";
import {
  FixtureContext,
  FixtureOptions,
  PluginConfig,
  validatePlugins,
} from "./plugin";
import { FluseScenarioComposer } from "./scenario";

export type FluseOptions<TPluginConfig extends PluginConfig> = {
  plugins?: TPluginConfig;
};

export function fluse<TPluginConfig extends PluginConfig = never>(
  options?: FluseOptions<TPluginConfig>
) {
  const plugins: TPluginConfig = options?.plugins ?? ({} as TPluginConfig);
  validatePlugins(plugins);

  function fixture<TResult, TArgs = never>(
    config: FixtureDefinitionConfig<
      FixtureContext<TPluginConfig>,
      TResult,
      TArgs
    >
  ): FixtureDefinition<TResult, TArgs, FixtureOptions<TPluginConfig>> {
    return (((args?: TArgs) => {
      const fixture = new FluseFixture<
        FixtureContext<TPluginConfig>,
        TResult,
        TArgs,
        FixtureOptions<TPluginConfig>
      >(plugins, config, args);

      withFluseSymbol(fixture, FluseTypes.Fixture);
      return fixture;
    }) as unknown) as FixtureDefinition<
      TResult,
      TArgs,
      FixtureOptions<TPluginConfig>
    >;
  }

  function scenario() {
    const builder = new FluseScenarioComposer<
      FixtureContext<TPluginConfig>,
      FixtureOptions<TPluginConfig>
    >(plugins);

    withFluseSymbol(builder, FluseTypes.ScenarioComposer);
    return builder;
  }

  return {
    fixture,
    scenario,
  };
}
