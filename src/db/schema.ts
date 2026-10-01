import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  user: UserTable;
  event: EventTable;
}

export interface UserTable {
  id: Generated<number>;
  first_name: string;
  last_name: string | null;
  email: string;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
  deleted_at: DeletedAt;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface EventTable {
  id: Generated<number>;
  name: string;
  venue: string;
  created_at: ColumnType<Date, string | null, never>;
}

export type Event = Selectable<EventTable>;
export type NewEvent = Insertable<EventTable>;
export type EventUpdate = Updateable<EventTable>;

// <select, insert, update>
type CreatedAt = ColumnType<Date, string | Date | undefined, never>;
type UpdatedAt = ColumnType<Date, string | Date | undefined, Generated<Date>>;
type DeletedAt = ColumnType<
  Date | null,
  string | Date | undefined,
  string | Date | undefined
> | null;
