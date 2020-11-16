/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CombinedFixtureBuilder,
  Fixture,
  fixture,
  FixtureDefinition,
  FixtureFactory,
  isFixture,
} from "./fixture";
import { FluseTypes, withFluseSymbol } from "./internal";
import {
  composeMiddlewares,
  PluginConfig,
  RootContext,
  RootOptions,
  validatePlugins,
} from "./plugin";

export type FluseOptions<TPluginConfig extends PluginConfig> = {
  plugins?: TPluginConfig;
};

export interface Fluse<TPluginConfig extends PluginConfig> {
  execute: <TResult>(
    fixture: Fixture<RootContext<TPluginConfig>, TResult>,
    options?: RootOptions<TPluginConfig>
  ) => Promise<TResult>;

  fixture: <TResult, TArgs = unknown>(
    definition: FixtureDefinition<RootContext<TPluginConfig>, TResult, TArgs>
  ) => FixtureFactory<RootContext<TPluginConfig>, TResult, TArgs>;

  combine: () => CombinedFixtureBuilder<RootContext<TPluginConfig>>;
}

export function fluse<TPluginConfig extends PluginConfig = never>(
  options?: FluseOptions<TPluginConfig>
): Fluse<TPluginConfig> {
  const plugins: TPluginConfig = options?.plugins ?? ({} as TPluginConfig);

  validatePlugins(plugins);

  async function execute<TResult>(
    fixture: Fixture<RootContext<TPluginConfig>, TResult>,
    options?: RootOptions<TPluginConfig>
  ) {
    if (!isFixture(fixture)) {
      throw new Error(
        "The provided fixture is not valid." +
          "\n\nA valid fixture should be created by 'fixture()' or 'combine()'"
      );
    }

    const pluginOptions = options ?? {};
    const rootContext = {} as RootContext<TPluginConfig>;
    withFluseSymbol(rootContext, FluseTypes.Context);

    const resolve = composeMiddlewares<RootContext<TPluginConfig>>(
      plugins,
      pluginOptions,
      (ctx) => {
        return fixture.create(ctx);
      }
    );

    return resolve(rootContext);
  }

  function combine() {
    return new CombinedFixtureBuilder<RootContext<TPluginConfig>>();
  }

  return {
    execute,
    fixture,
    combine,
  };
}
