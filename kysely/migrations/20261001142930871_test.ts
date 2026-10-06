import { type Kysely } from "kysely";
import { addTimestamps } from "../timestamps";

export async function up(db: Kysely<any>): Promise<void> {
  await addTimestamps(
    db.schema
      .createTable("event")
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("venue", "varchar", (col) => col.notNull()),
    { deletedAt: true },
  ).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("event").execute();
}
