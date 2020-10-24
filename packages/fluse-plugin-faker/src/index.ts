import faker from "faker";
import { createPlugin } from "fluse";

type FakerContext = Faker.FakerStatic;

interface FakerPluginConfig {
  faker?: Faker.FakerStatic;
}

function fakerPlugin(config?: FakerPluginConfig) {
  const fakerInstance = config?.faker ?? faker;

  return createPlugin<FakerContext>({
    name: "faker",
    version: "0.x",
    execute(next) {
      return next(fakerInstance);
    },
  });
}

export default fakerPlugin;
