import { createPlugin } from "fluse";
import { CommonQueryMethodsType, DatabasePoolType } from "slonik";

type SlonikContext = CommonQueryMethodsType;

type SlonikPluginConfig = {
  pool: DatabasePoolType;
  transaction?: boolean;
};

function slonikPlugin(config: SlonikPluginConfig) {
  const { pool, transaction = true } = config;

  if (!pool) {
    throw new Error(
      "An error occured trying to initialize 'fluse-plugin-slonik': Pool should be initialized."
    );
  }

  return createPlugin<SlonikContext>({
    name: "slonik",
    version: "0.x",
    execute(next) {
      if (transaction) {
        return pool.transaction((trx) => {
          return next(trx);
        });
      } else {
        return next(pool);
      }
    },
  });
}

export default slonikPlugin;
