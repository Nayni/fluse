/* eslint-disable @typescript-eslint/no-explicit-any */

import { Fixture, isFixture } from "./fixture";
import { composePluginExecutorMiddlewares, Plugin } from "./plugin";

export type SeederOptions = {
  plugins?: Plugin[];
};

export class Seeder {
  private plugins: ReturnType<Plugin>[];

  constructor(private options: SeederOptions) {
    // TODO: Check for duplicate plugins.
    this.plugins = (this.options.plugins || []).map((plugin) => plugin({}));
  }

  async seed<T>(fixture: Fixture<T>) {
    if (!isFixture(fixture)) {
      throw new Error(
        "An unexpected error occured while seeding: " +
          "the provided fixture is not valid." +
          "\n\nA valid fixture is a plain object with a 'create' method."
      );
    }

    const executor = await composePluginExecutorMiddlewares(
      this.plugins,
      (fixture, context) => fixture.create(context)
    );

    return executor(fixture, {});
  }
}
