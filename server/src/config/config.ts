import { Dialect } from 'sequelize/types';
import { logger } from '../utils/winston';

import * as dotenv from 'dotenv';
dotenv.config();

type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  logging: any;
};

interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}

const config: IConfigGroup = {
  development: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: 'mysql',
    logging: (msg: any) => logger.info(msg),
  },
  test: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: 'mysql',
    logging: (msg: any) => logger.info(msg),
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: 'mysql',
    logging: false,
  },
};

export default config;
