import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("ticket_type")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("event_id", "integer", (col) =>
      col.references("event.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp")
    .execute();

  await db.schema
    .createTable("ticket_type_inventory")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("ticket_type_id", "integer", (col) =>
      col.references("ticket_type.id").unique().notNull(),
    )
    .addColumn("reserved", "integer", (col) =>
      col.notNull().check(sql`reserved > 0 AND reserved <= capacity`),
    )
    .addColumn("capacity", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("first_name", "varchar", (col) => col.notNull())
    .addColumn("last_name", "varchar")
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp")
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createType("reservation_status")
    .asEnum(["HOLD", "CONFIRMED", "EXPIRED", "CANCELLED"])
    .execute();

  await db.schema
    .createTable("reservation")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("status", sql`"reservation_status"`, (col) => col.notNull())
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").notNull(),
    )
    .addColumn("ticket_type_id", "integer", (col) =>
      col.references("ticket_type.id").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp")
    .addColumn("expires_at", "timestamp", (col) =>
      col.defaultTo(sql`now() + INTERVAL '15 minutes'`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code to update schema to previous version
  await db.schema.dropTable("reservation").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("ticket_type_inventory").execute();
  await db.schema.dropTable("ticket_type").execute();
  await db.schema.dropType("reservation_status").ifExists().execute();
}
