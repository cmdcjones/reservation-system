import { expect, test, beforeEach, afterEach, afterAll } from "vitest";
import { type ControlledTransaction } from "kysely";

import { createDb, type Database } from "../../db";
import { config } from "../../config";
import { createEventService } from "../../services";
import { eventRepository } from "../../repositories/event";

const testDb = createDb(config.testDbUrl);

let trx: ControlledTransaction<Database, []> | undefined;

beforeEach(async () => {
  trx = await testDb.startTransaction().execute();
});

afterEach(async () => {
  await trx?.rollback().execute();
});

afterAll(async () => {
  await testDb.destroy();
});

function executor(): ControlledTransaction<Database, []> {
  if (!trx) {
    throw new Error("Test transaction was not started");
  }
  return trx;
}

test("should create one event row", async () => {
  await expect(
    createEventService(executor()).create("test", "test venue"),
  ).resolves.toHaveProperty("id");
});

test("should throw when event is deleted", async () => {
  const eventService = createEventService(executor());
  const newEvent = await eventService.create("test", "test venue");
  await eventRepository.deleteEvent(newEvent.id, executor());
  await expect(eventService.findById(newEvent.id)).rejects.toThrow(
    "Event deleted",
  );
});
