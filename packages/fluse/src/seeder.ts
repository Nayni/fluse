/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import semver from "semver";
import { Fixture, isFixture } from "./fixture";
import { composePluginExecutorMiddlewares, Plugin } from "./plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

export type SeederOptions<T> = {
  fixture: Fixture<T>;
  plugins?: Array<Plugin>;
};

export class Seeder<T> {
  private fixture: Fixture<T>;
  private plugins: Plugin[];

  constructor(options: SeederOptions<T>) {
    if (!isFixture(options.fixture)) {
      throw new Error(
        "The provided fixture is not valid." +
          "\n\nA valid fixture is a plain object with a 'create' method."
      );
    }
    this.fixture = options.fixture;

    this.plugins = options.plugins || [];
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

  private validatePlugins(plugins: Plugin[]) {
    const duplicatePlugins = _.chain(plugins)
      .groupBy((p) => p.name)
      .pickBy((x) => x.length > 1)
      .keys()
      .value();

    if (duplicatePlugins.length > 0) {
      throw new Error(
        "Duplicate plugins found. It is not allowed to use a plugin more than once." +
          `\nThe following plugins were found with duplicates: ${duplicatePlugins.join(
            ", "
          )}.`
      );
    }

    plugins.forEach((plugin) => {
      if (!semver.satisfies(packageJson.version, plugin.version)) {
        throw new Error(
          `Plugin version (${plugin.version}) of '${plugin.name}' is not compatible with this version (${packageJson.version}) of fluse.`
        );
      }
    });
  }
}
