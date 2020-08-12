import { PluginFn } from "fluse";
import { CommonQueryMethodsType, DatabasePoolType } from "slonik";

type SlonikContext = CommonQueryMethodsType;

type SlonikPluginConfig = {
  pool: DatabasePoolType;
  transaction?: boolean;
  onBefore?: (pool: DatabasePoolType) => Promise<void>;
  onAfter?: (pool: DatabasePoolType) => Promise<void>;
};

declare module "fluse" {
  interface FixtureContext {
    slonik: SlonikContext;
  }
}

const plugin: PluginFn<SlonikPluginConfig> = (config = {}) => {
  const { pool, transaction = true, onBefore, onAfter } = config;

  if (!pool) {
    throw new Error("Pool should be initialized.");
  }

  return {
    name: "slonik",
    version: "0.x",
    async onBefore() {
      if (onBefore) {
        await onBefore(pool);
      }
    },
    async onAfter() {
      if (onAfter) {
        await onAfter(pool);
      }
    },
    onCreateExecutor() {
      return async (fixture, next) => {
        if (transaction) {
          return pool.transaction(async (trx) => {
            const result = await next(fixture, trx);
            return result;
          });
        } else {
          const result = await next(fixture, pool);
          return result;
        }
      };
    },
  };
};

export default plugin;
