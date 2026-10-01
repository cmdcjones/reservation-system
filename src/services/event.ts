import { type Event } from "../db/schema";
import { eventRepository } from "../repositories/event";

export const eventService = {
  async findById(id: number): Promise<Event> {
    const event = await eventRepository.findEventById(id);
    if (!event) {
      throw new Error("Event does not exist");
    }

    if (event.deleted_at) {
      throw new Error("Event deleted");
    }
    return event;
  },
};
