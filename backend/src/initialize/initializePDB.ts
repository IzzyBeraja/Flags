import dotenv from "dotenv";
import { createConnection } from "mysql2/promise";

dotenv.config();

const database = process.env["PLANETSCALE_DB_URL"] ?? "";

export default async function initializePDB(error: Array<Error>) {
  const connection = await createConnection(database);

  try {
    await connection.ping();
  } catch (err) {
    error.push(err as Error);
  }

  return connection;
}
