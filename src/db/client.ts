import { type Database } from "./schema";
import { Pool } from "pg";
import { Kysely, PostgresDialect, Transaction } from "kysely";
import { config } from "../config";

export function createDb(connectionString: string): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
        max: 20,
      }),
    }),
  });
}

export const db = createDb(config.dbUrl);

export type TxOrDb = Kysely<Database> | Transaction<Database>;

export async function withTransaction<T>(
  executor: TxOrDb,
  callback: (trx: Transaction<Database>) => Promise<T>,
): Promise<T> {
  if (executor instanceof Transaction) {
    return callback(executor);
  }

  return executor.transaction().execute(callback);
}
