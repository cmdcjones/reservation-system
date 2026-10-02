import { type Database } from "./schema"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { ControlledTransaction, Kysely, PostgresDialect } from "kysely";
import { config } from "../config";

export type TxOrDb = Kysely<Database> | ControlledTransaction<Database, []>;

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: config.dbUrl,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
