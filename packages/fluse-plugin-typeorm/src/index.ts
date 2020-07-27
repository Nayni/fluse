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
  synchronize?: boolean;
  dropBeforeSync?: boolean;
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
  const {
    connection = "default",
    transaction = true,
    synchronize = false,
    dropBeforeSync = false,
  } = config;

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
    version: "0.1.x",
    async onBefore() {
      if (synchronize) {
        const connection = await getOrCreateConnection();
        await connection.synchronize(dropBeforeSync);
      }
    },
    onCreateExecutor() {
      return async (fixture, next) => {
        const connection = await getOrCreateConnection();

        if (transaction) {
          return connection.transaction(async (entityManager) => {
            const result = await next(fixture, {
              connection,
              entityManager,
            });
            return result;
          });
        } else {
          const result = await next(fixture, {
            connection,
            entityManager: connection.createEntityManager(),
          });
          return result;
        }
      };
    },
  };
};

export default plugin;
