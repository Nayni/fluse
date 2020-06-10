/* eslint-disable @typescript-eslint/no-explicit-any */

import isNil from "lodash.isnil";
import { Fixture, isFixture } from "./fixture";
import { composeSeedMiddlewareFns, isSeedMiddlewareFn, Plugin } from "./plugin";
import { isDefined } from "./utils";

export type SeederOptions = {
  plugins?: Plugin[];
};

export class Seeder {
  private plugins: Plugin[];
  private onCreatSeedExecutorFns: Exclude<
    Plugin["onCreatSeedExecutor"],
    undefined
  >[];

  constructor(private options: SeederOptions) {
    // TODO: Check for duplicate plugins.
    this.plugins = this.options.plugins || [];
    this.onCreatSeedExecutorFns = this.plugins
      .map((p) => p.onCreatSeedExecutor)
      .filter(isDefined);
  }

  async seed<T>(fixture: Fixture<T>) {
    if (!isFixture(fixture)) {
      throw new Error(
        "An unexpected error occured while seeding: " +
          "the provided fixture is not valid." +
          "\n\nA valid fixture is a plain object with a 'create' method."
      );
    }

    const context = await this.createContext();
    const executor = await this.createFinalExecutor(context);
    return executor(fixture);
  }

  private async createFinalExecutor(context: FluseFixtureContext) {
    const toCompose = (
      await Promise.all(this.onCreatSeedExecutorFns.map((fn) => fn()))
    ).filter(isSeedMiddlewareFn);

    return composeSeedMiddlewareFns(toCompose, (fixture) =>
      fixture.create(context)
    );
  }

  private async createContext(): Promise<FluseFixtureContext> {
    const finalContext: Record<string, any> = {};

    for (const plugin of this.plugins) {
      if (isNil(plugin.onCreateContext)) {
        continue;
      }

      const pluginContext = await Promise.resolve(plugin.onCreateContext());

      if (typeof pluginContext !== "object") {
        throw new Error("Ctx must be object");
      }

      finalContext[plugin.name] = pluginContext;
    }

    return finalContext as FluseFixtureContext;
  }
}
