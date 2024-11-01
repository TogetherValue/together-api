import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';
import { SeederOptions } from 'typeorm-extension';

const nodeEnv = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `./dotenv/.env.${nodeEnv}` });
const entityPath = path.join(__dirname + '/src/entities/*/*.entity.ts');

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.NODE_ENV === 'setUp' ? process.env.DB_HOST : 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [entityPath],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  seeds: ['./src/core/database/typeorm/seeds/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);
