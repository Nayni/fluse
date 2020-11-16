import { createPlugin } from "fluse";
import {
  Connection,
  createConnection,
  EntityManager,
  getConnection,
  getConnectionManager,
} from "typeorm";

interface TypeORMPluginConfig {
  connection?: Connection | string;
  transaction?: boolean;
  synchronize?: boolean;
  dropBeforeSync?: boolean;
}

interface TypeORMContext {
  connection: Connection;
  entityManager: EntityManager;
}

function typeORMPlugin(config?: TypeORMPluginConfig) {
  function getOrCreateConnection(opts: TypeORMPluginConfig) {
    if (opts.connection instanceof Connection) {
      return Promise.resolve(opts.connection);
    }
    if (getConnectionManager().has(opts.connection ?? "default")) {
      return Promise.resolve(getConnection(opts.connection));
    }

    return createConnection(opts.connection ?? "default");
  }

  return createPlugin<TypeORMContext, TypeORMPluginConfig>({
    name: "typeorm",
    version: "0.x",
    async execute(next, opts) {
      const options = {
        ...config,
        ...opts,
      };

      const connection = await getOrCreateConnection(options);

      if (options.synchronize) {
        await connection.synchronize(options.dropBeforeSync);
      }

      if (options.transaction) {
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
