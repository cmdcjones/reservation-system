import { type Event, type TxOrDb } from "../db";

const eventColumns = ["id", "name", "venue", "deleted_at"] as const;

export type EventRow = Pick<Event, (typeof eventColumns)[number]>;

export const eventRepository = {
  async findEventById(
    id: number,
    executor: TxOrDb,
  ): Promise<EventRow | undefined> {
    return await executor
      .selectFrom("event")
      .where("id", "=", id)
      .select(eventColumns)
      .executeTakeFirst();
  },

  async insertOneEvent(
    name: string,
    venue: string,
    executor: TxOrDb,
  ): Promise<EventRow> {
    return await executor
      .insertInto("event")
      .values({ name, venue })
      .returning(eventColumns)
      .executeTakeFirstOrThrow();
  },

  async updateEvent(
    id: number,
    name: string,
    venue: string,
    executor: TxOrDb,
  ): Promise<EventRow> {
    return await executor
      .updateTable("event")
      .set({ name, venue })
      .where("id", "=", id)
      .returning(eventColumns)
      .executeTakeFirstOrThrow();
  },

  async deleteEvent(id: number, executor: TxOrDb): Promise<void> {
    await executor
      .updateTable("event")
      .set({ deleted_at: new Date() })
      .where("id", "=", id)
      .execute();
  },
};
