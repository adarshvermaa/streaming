import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: string | number;
  HOST?: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  KAFKA_BROKER: string;
  KAFKA_TOPIC: string;
  KAFKA_GROUP_ID: string;
  NODE_ENV: string;
  SMTP_PASSWORD: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  JWT_SECRET_KEY: string;
  FRONTEND_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SESSION_SECRET: string;
  FRONTEND_URL_LIVE: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL_LIVE_FAILURE: string;
}

export const ENV: EnvConfig = {
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || 'localhost',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME || '',
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092',
  KAFKA_TOPIC: process.env.KAFKA_TOPIC || 'socket-topic',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'socket-group',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  JWT_SECRET_KEY: process.env.JWT_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID! || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET! || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
  FRONTEND_URL_LIVE: process.env.FRONTEND_URL_LIVE || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
  FRONTEND_URL_LIVE_FAILURE: process.env.FRONTEND_URL_LIVE_FAILURE || '',
};
