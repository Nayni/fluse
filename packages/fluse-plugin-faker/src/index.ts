import faker from "faker";
import { PluginFn } from "fluse";

type FakerContext = Faker.FakerStatic;

declare module "fluse" {
  interface FixtureContext {
    faker: FakerContext;
  }
}

const plugin: PluginFn<{}> = () => {
  return {
    name: "faker",
    version: "0.x",
    onCreateExecutor() {
      return (fixture, next) => next(fixture, faker);
    },
  };
};

export default plugin;
