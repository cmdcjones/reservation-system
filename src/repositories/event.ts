import { db } from "../db";
import type { Event, NewEvent, EventUpdate } from "../db/schema";

export const eventRepository = {
  async findEventById(id: number): Promise<Event | undefined> {
    return await db
      .selectFrom("event")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  },
};
