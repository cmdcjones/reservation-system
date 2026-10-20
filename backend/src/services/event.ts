import { db, type TxOrDb } from "../db";
import { eventRepository, type EventRow } from "../repositories/event";

export function createEventService(executor: TxOrDb = db) {
  return {
    async findById(id: number): Promise<EventRow> {
      const event = await eventRepository.findEventById(id, executor);
      if (!event) {
        throw new Error("Event does not exist");
      }

      if (event.deleted_at) {
        throw new Error("Event deleted");
      }
      return event;
    },

    async create(name: string, venue: string): Promise<EventRow> {
      return await eventRepository.insertOneEvent(name, venue, executor);
    },
  };
}
