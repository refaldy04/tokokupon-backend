import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';

export default (): PostgresConnectionOptions => ({
  url: process.env.url,
  type: 'postgres',
  port: +process.env.port,
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  // untuk development, jika tidak sengaja menghapus kolom maka akan permanen
  synchronize: false,
});
