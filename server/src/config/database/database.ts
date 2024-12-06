import { Sequelize } from 'sequelize-typescript';
import { ENV } from '../env';

const sequelize = new Sequelize({
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  dialect: 'postgres',
  username: ENV.DB_USER,
  password: ENV.DB_PASS,
  port: ENV.DB_PORT,
  models: [__dirname + '/../models'],
  logging: false,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

export default sequelize;
