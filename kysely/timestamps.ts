import { sql, type CreateTableBuilder } from "kysely";

type TableBuilder = CreateTableBuilder<any, any>;

export function addTimestamps(
  table: TableBuilder,
  options: { deletedAt?: boolean } = {},
): TableBuilder {
  const withTimes = table
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp");

  if (!options.deletedAt) {
    return withTimes;
  }

  return withTimes.addColumn("deleted_at", "timestamp");
}
