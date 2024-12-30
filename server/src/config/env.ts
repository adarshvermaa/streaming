import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: string | number;
  HOST: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  KAFKA_BROKER: string;
  KAFKA_TOPIC: string;
  KAFKA_GROUP_ID: string;
  NODE_ENV: string;
}

export const ENV = {
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME || '',
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092',
  KAFKA_TOPIC: process.env.KAFKA_TOPIC || 'socket-topic',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'socket-group',
  NODE_ENV: process.env.NODE_ENV || 'development',
};