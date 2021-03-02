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
        host: 'john.db.elephantsql.com',
        port: 5432,
        database: 'tbeiekcb',
        username: 'tbeiekcb',
        password: '5cRF60aQPKK_GTHwc4_BHTCvmMKgH_Iw',
        synchronize: true,
        entities: [Customer],
      });
    })();

  }

  return connectionReadyPromise;
}
