import _ from "lodash";
import semver from "semver";
import { Fixture, isFixture } from "./fixture";
import {
  composePluginAfterHooks,
  composePluginBeforeHooks,
  composePluginExecutorMiddlewares,
  Plugin,
} from "./plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

export type ExecuteOptions = {
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

function createExecutor<TResult>(plugins: Plugin[]) {
  const executor = composePluginExecutorMiddlewares<TResult>(
    plugins,
    (fixture, context) => fixture.create(context)
  );

  return executor;
}

/**
 * Executes a given fixture.
 *
 * @param fixture The fixture to execute, can be a single fixture or a combined fixture.
 * @param options Additional options to use during execution. Primarily used to define any plugins to include at runtime.
 */
export async function execute<TResult>(
  fixture: Fixture<TResult>,
  options?: ExecuteOptions
) {
  if (!isFixture(fixture)) {
    throw new Error(
      "The provided fixture is not valid." +
        "\n\nA valid fixture should be created by 'fixture()' or 'combine()'"
    );
  }

  const rootContext = {};
  const plugins = options?.plugins ?? [];

  validatePlugins(plugins);

  const beforeHooks = composePluginBeforeHooks(plugins);
  const afterHooks = composePluginAfterHooks(plugins);
  const executor = createExecutor<TResult>(plugins);

  await beforeHooks();
  const result = await executor(fixture, rootContext);
  await afterHooks();
  return result;
}
