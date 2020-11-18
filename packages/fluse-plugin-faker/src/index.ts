import faker from "faker";
import { createPlugin } from "fluse";

export type FakerContext = Faker.FakerStatic;

export interface FakerPluginOptions {
  faker?: Faker.FakerStatic;
}

function fakerPlugin(defaultOptions?: FakerPluginOptions) {
  return createPlugin<FakerContext, FakerPluginOptions>({
    name: "faker",
    version: "0.x",
    execute(next, runtimeOptions) {
      const options = {
        ...defaultOptions,
        ...runtimeOptions,
      };

      return next(options.faker ?? faker);
    },
  });
}

export default fakerPlugin;
