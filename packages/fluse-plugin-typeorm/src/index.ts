import { createPlugin } from "fluse";
import {
  Connection,
  createConnection,
  EntityManager,
  getConnection,
  getConnectionManager,
} from "typeorm";

export interface TypeORMPluginOptions {
  connection?: Connection | string;
  transaction?: boolean;
  synchronize?: boolean;
  dropBeforeSync?: boolean;
}

export interface TypeORMContext {
  connection: Connection;
  entityManager: EntityManager;
}

function typeORMPlugin(defaultOptions?: TypeORMPluginOptions) {
  return createPlugin<TypeORMContext, TypeORMPluginOptions>({
    name: "typeorm",
    version: "0.x",
    async execute(next, runtimeOptions) {
      const options: TypeORMPluginOptions = {
        ...defaultOptions,
        ...runtimeOptions,
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

function getOrCreateConnection({ connection }: TypeORMPluginOptions) {
  if (connection instanceof Connection) {
    return Promise.resolve(connection);
  }
  if (getConnectionManager().has(connection ?? "default")) {
    return Promise.resolve(getConnection(connection));
  }

  return createConnection(connection ?? "default");
}

export default typeORMPlugin;
