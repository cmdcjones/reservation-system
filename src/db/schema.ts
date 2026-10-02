import type {
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

// <select, insert, update>
type CreatedAt = ColumnType<Date, string | Date | undefined, never>;
type UpdatedAt = ColumnType<Date, string | Date | undefined, Generated<Date>>;
type DeletedAt = ColumnType<
  Date | null,
  string | Date | undefined,
  string | Date | undefined
> | null;

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
  created_at: CreatedAt;
  updated_at: UpdatedAt;
  deleted_at: DeletedAt;
}

export type Event = Selectable<EventTable>;
export type NewEvent = Insertable<EventTable>;
export type EventUpdate = Updateable<EventTable>;

export enum ReservationStatus {
  HOLD = "HOLD",
  CONFIRMED = "CONFIRMED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export interface ReservationTable {
  id: Generated<number>;
  status: ReservationStatus;
  user_id: number;
  ticket_type_id: number;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
  expires_at: ColumnType<Date, string | null, never>;
}

export type Reservation = Selectable<ReservationTable>;
export type NewReservation = Insertable<ReservationTable>;
export type ReservationUpdate = Updateable<ReservationTable>;

export interface TicketTypeTable {
  id: Generated<number>;
  event_id: number;
  name: string;
  created_at: CreatedAt;
}

export type TicketType = Selectable<TicketTypeTable>;
export type NewTicketType = Insertable<TicketTypeTable>;
export type TicketTypeUpdate = Updateable<TicketTypeTable>;

export interface TicketTypeInventoryTable {
  id: Generated<number>;
  ticket_type_id: number;
  reserved: number;
  capacity: number;
}
