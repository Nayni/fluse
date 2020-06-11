import { Plugin } from "@fluse/core";
import {
  createConnection,
  EntityManager,
  getConnection,
  getConnectionManager,
} from "typeorm";

type TypeORMPluginConfig = {
  connectionName?: string;
};

type TypeORMContext = {
  entityManager: EntityManager;
};

declare module "@fluse/core" {
  interface FixtureContext {
    typeorm: TypeORMContext;
  }
}

const plugin: Plugin<TypeORMPluginConfig> = ({
  connectionName = "default",
}) => {
  async function getActiveConnection() {
    return getConnectionManager().has(connectionName)
      ? getConnection(connectionName)
      : await createConnection(connectionName);
  }

  return {
    name: "typeorm",
    version: "0.0.1",
    onCreateExecutor() {
      return async (fixture, next) => {
        const connection = await getActiveConnection();

        return connection.transaction(async (runInTransaction) => {
          const result = await next(fixture, {
            entityManager: runInTransaction,
          });
          return result;
        });
      };
    },
  };
};

export default plugin;
