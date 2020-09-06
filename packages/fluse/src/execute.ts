import _ from "lodash";
import semver from "semver";
import { Fixture, isFixture } from "./fixture";
import { FluseTypes, withFluseSymbol } from "./internal";
import {
  composePluginAfterHooks,
  composePluginBeforeHooks,
  composePluginExecutorMiddlewares,
  Plugin,
} from "./plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

export type CreateExecutorOptions = {
  plugins?: Plugin[];
};

function validatePlugins(plugins: Plugin[]) {
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

/**
 * Creates a fixture executor.
 * The executor allows you to run any fixture created by 'fixture' or 'combine'.
 *
 * @param options Additional options to use during execution.
 */
export function createExecutor(options?: CreateExecutorOptions) {
  const plugins = options?.plugins ?? [];

  validatePlugins(plugins);

  return async function execute<TResult>(fixture: Fixture<TResult>) {
    if (!isFixture(fixture)) {
      throw new Error(
        "The provided fixture is not valid." +
          "\n\nA valid fixture should be created by 'fixture()' or 'combine()'"
      );
    }

    const rootContext = {};
    withFluseSymbol(rootContext, FluseTypes.Context);

    const beforeHooks = composePluginBeforeHooks(plugins);
    const afterHooks = composePluginAfterHooks(plugins);
    const executor = composePluginExecutorMiddlewares<TResult>(
      plugins,
      (fixture, context) => fixture.create(context)
    );

    await beforeHooks();
    const result = await executor(fixture, rootContext);
    await afterHooks();
    return result;
  };
}
