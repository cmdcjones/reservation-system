import { db } from "../db";
import type { Event, NewEvent, EventUpdate } from "../db/schema";

export async function findEventById(id: number) {
  return await db
    .selectFrom("event")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}
