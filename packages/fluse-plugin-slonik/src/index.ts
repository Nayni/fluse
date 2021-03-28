import { createPlugin } from "fluse";
import { CommonQueryMethodsType, DatabasePoolType } from "slonik";

export type SlonikContext = CommonQueryMethodsType;

export type SlonikPluginOptions = {
  pool: DatabasePoolType;
  transaction?: boolean;
};

function slonikPlugin(defaultOptions?: SlonikPluginOptions) {
  return createPlugin<SlonikContext, SlonikPluginOptions>({
    name: "slonik",
    version: "^1.0.0",
    execute(next, runtimeOptions) {
      const options: SlonikPluginOptions = {
        ...defaultOptions,
        ...runtimeOptions,
      };

      const pool = getPool(options);

      if (options.transaction) {
        return pool.transaction((trx) => {
          return next(trx);
        });
      } else {
        return next(pool);
      }
    },
  });
}

function getPool(options: SlonikPluginOptions) {
  if (!options.pool) {
    throw new Error(
      "An error occured in 'fluse-plugin-slonik': Pool should be initialized."
    );
  }

  return options.pool;
}

export default slonikPlugin;
