import mongoose from 'mongoose';
import { DB_URI, DB_NAME as dbName } from '../config'

export const startDatabase = (function database() {
  const startdb = async () => {
    try {
      console.info('Connecting to zha database 😁');
      
      mongoose.set('strictQuery', false);

      await mongoose.connect(DB_URI, { dbName })

      console.info('Successfully connected to zha database 🎉!');
    } catch (err: any) {
      console.error(`${err.name}: ${err.message}, and as a result database connection failed 🥲`);
      console.info('Please wait while we attempt to reconnect 😰');
      setTimeout(startdb, 5000);
    }
  };

  startdb();
});