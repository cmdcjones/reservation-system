// Auto-generated migration file
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable("reservation")
        .addColumn("quantity", "integer", (col) =>
            col.check(sql`quantity > 0`).notNull(),
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable("reservation").dropColumn("quantity").execute();
}
