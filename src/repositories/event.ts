import {
  type Event,
  type NewEvent,
  type EventUpdate,
  type TxOrDb,
  db,
} from "../db";

export const eventRepository = {
  async findEventById(
    id: number,
    txOrDb: TxOrDb = db,
  ): Promise<Partial<Event> | undefined> {
    return await txOrDb
      .selectFrom("event")
      .where("id", "=", id)
      .select(["id", "name", "venue", "deleted_at"])
      .executeTakeFirst();
  },

  async insertOneEvent(
    name: string,
    venue: string,
    txOrDb: TxOrDb = db,
  ): Promise<NewEvent> {
    return await txOrDb
      .insertInto("event")
      .values({ name, venue })
      .returning(["id", "name", "venue", "deleted_at"])
      .executeTakeFirstOrThrow();
  },

  async updateEvent(
    id: number,
    name: string,
    venue: string,
    txOrDb: TxOrDb = db,
  ): Promise<EventUpdate> {
    return await txOrDb
      .updateTable("event")
      .set({ name, venue })
      .where("id", "=", id)
      .returning(["id", "name", "venue", "deleted_at"])
      .executeTakeFirstOrThrow();
  },
};
