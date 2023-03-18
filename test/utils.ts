import 'dotenv/config';

import { Client } from 'pg';
const getDbConnection = async (): Promise<Client> => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  client.connect();
  return client;
};

export const activateApiKey = async (apiKey: string): Promise<any> => {
  const connection = await getDbConnection();
  const res = await connection.query('UPDATE api_key SET enabled_on = $1 where api_key = $2', [
    new Date().toISOString(),
    apiKey,
  ]);
  await connection.end();
  return res;
};
