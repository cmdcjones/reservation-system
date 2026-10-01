import dotenv from "dotenv";
dotenv.config();

import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import { Kysely, PostgresDialect } from "kysely";
import {
  FileMigrationProvider,
  Migrator,
  NO_MIGRATIONS,
} from "kysely/migration";
import { Database } from "../src/db/schema";

type MigrationFlag = "reset" | undefined;

async function handleMigrations() {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env["DATABASE_URL"],
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path
      migrationFolder: path.join(import.meta.dirname, "/migrations"),
    }),
  });

  const flag = process.argv[2] as MigrationFlag;

  if (flag === "reset") {
    await resetMigrations(db, migrator);
  }

  await migrateToLatest(migrator);
  await db.destroy();
}

async function migrateToLatest(migrator: Migrator) {
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    console.log(it);
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }
}

async function resetMigrations(db: Kysely<Database>, migrator: Migrator) {
  console.log("Resetting migrations");
  try {
    await migrator.migrateTo(NO_MIGRATIONS);
  } catch (e: any) {
    console.error("Failed to reset migrations");
  }
}

handleMigrations();
