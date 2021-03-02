import { createConnection, getConnection } from "typeorm";

import { Customer } from './entities/Customer';

let connectionReadyPromise: Promise<void> | null = null;

export default function prepareConnection() {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        console.log(error);
      }
      await createConnection({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        database: 'damsen',
        username: 'onggieoi',
        password: 'onggieoi@123',
        synchronize: true,
        entities: [Customer],
      });
    })();

  }

  return connectionReadyPromise;
}
