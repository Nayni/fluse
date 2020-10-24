import { createPlugin } from "fluse";
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

function typeORMPlugin(config: TypeORMPluginConfig) {
  const {
    connection,
    transaction = true,
    synchronize = false,
    dropBeforeSync = false,
  } = config;

  function getOrCreateConnection() {
    if (connection instanceof Connection) {
      return Promise.resolve(connection);
    }
    if (getConnectionManager().has(connection)) {
      return Promise.resolve(getConnection(connection));
    }

    return createConnection(connection);
  }

  return createPlugin<TypeORMContext>({
    name: "typeorm",
    version: "0.x",
    async execute(next) {
      const connection = await getOrCreateConnection();

      if (synchronize) {
        await connection.synchronize(dropBeforeSync);
      }

      if (transaction) {
        return connection.transaction((entityManager) => {
          return next({
            connection,
            entityManager,
          });
        });
      } else {
        const entityManager = connection.createEntityManager();
        return next({
          connection,
          entityManager,
        });
      }
    },
  });
}

export default typeORMPlugin;
