import { PluginFn } from "fluse";
import {
  Connection,
  createConnection,
  EntityManager,
  getConnection,
  getConnectionManager,
} from "typeorm";

type TypeORMPluginConfig = {
  connection: Connection | string;
  transaction?: boolean;
};

type TypeORMContext = {
  connection: Connection;
  entityManager: EntityManager;
};

declare module "fluse" {
  interface FixtureContext {
    typeorm: TypeORMContext;
  }
}

const plugin: PluginFn<TypeORMPluginConfig> = (config = {}) => {
  const { connection = "default", transaction = true } = config;

  const getOrCreateConnection = async () => {
    if (connection instanceof Connection) {
      return connection;
    }
    if (getConnectionManager().has(connection)) {
      return getConnection(connection);
    }

    return await createConnection(connection);
  };

  return {
    name: "typeorm",
    version: "0.0.x",
    onCreateExecutor() {
      return async (fixture, next) => {
        const conn = await getOrCreateConnection();

        if (transaction) {
          return conn.transaction(async (entityManager) => {
            const result = await next(fixture, {
              connection: conn,
              entityManager,
            });
            return result;
          });
        } else {
          const result = await next(fixture, {
            connection: conn,
            entityManager: conn.createEntityManager(),
          });
          return result;
        }
      };
    },
  };
};

export default plugin;
