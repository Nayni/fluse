/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import { Fixture, isFixture } from "./fixture";
import {
  composePluginExecutorMiddlewares,
  ConfiguredPlugin,
  Plugin,
} from "./plugin";

export type SeederOptions<T> = {
  fixture: Fixture<T>;
  plugins?: Array<Plugin | ConfiguredPlugin>;
};

export class Seeder<T> {
  private fixture: Fixture<T>;
  private plugins: ConfiguredPlugin[];

  constructor(options: SeederOptions<T>) {
    if (!isFixture(options.fixture)) {
      throw new Error(
        "The provided fixture is not valid." +
          "\n\nA valid fixture is a plain object with a 'create' method."
      );
    }
    this.fixture = options.fixture;

    const plugins = options.plugins || [];
    this.plugins = this.configurePlugins(plugins);
    this.validatePlugins(this.plugins);
  }

  async seed() {
    const executor = await composePluginExecutorMiddlewares<T>(
      this.plugins,
      (fixture, context) => fixture.create(context)
    );

    return executor(this.fixture, {});
  }

  async remove() {
    const executor = await composePluginExecutorMiddlewares(
      this.plugins,
      async (fixture, context) => {
        if (_.isNil(fixture.remove) || !_.isFunction(fixture.remove)) {
          return;
        }

        await fixture.remove(context);
      }
    );

    await executor(this.fixture, {});
  }

  private validatePlugins(plugins: ConfiguredPlugin[]) {
    const duplicatePlugins = _.chain(plugins)
      .groupBy((p) => p.name)
      .pickBy((x) => x.length > 1)
      .keys()
      .value();

    if (duplicatePlugins.length > 0) {
      throw new Error(
        "Duplicate plugins found. It is not allowed to use a plugin more than once." +
          `\nThe following plugins were found with duplicates: [ ${duplicatePlugins.join(
            ", "
          )} ].`
      );
    }

    // TODO: Version compatibility
  }

  private configurePlugins(plugins: Array<Plugin | ConfiguredPlugin>) {
    const configuredPlugins: ConfiguredPlugin[] = [];
    plugins.forEach((plugin) => {
      const configuredPlugin = _.isFunction(plugin) ? plugin({}) : plugin;
      configuredPlugins.push(configuredPlugin);
    });

    return configuredPlugins;
  }
}
