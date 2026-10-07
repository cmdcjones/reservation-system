import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    expect,
    test,
} from "vitest";
import { type ControlledTransaction } from "kysely";
import { createDb, Database } from "../../db";
import { config } from "../../config";
import {
    createReservationService,
    createTicketTypeService,
} from "../../services";
import { eventRepository } from "../../repositories/event";
import { TicketTypeRow } from "../../repositories/ticket_type";

const testDb = createDb(config.testDbUrl);

let trx: ControlledTransaction<Database, []> | undefined;
let ticketType: TicketTypeRow | undefined;

beforeEach(async () => {
    trx = await testDb.startTransaction().execute();
});

afterEach(async () => {
    await trx?.rollback().execute();
});

beforeAll(async () => {
    const tx = await testDb.startTransaction().execute();
    try {
        const event = await eventRepository.insertOneEvent(
            "test",
            "test-venue",
            tx,
        );

        ticketType = await createTicketTypeService(
            tx,
        ).createWithTicketTypeInventory(event.id, "test-general", 100);

        await tx.commit().execute();
    } catch (error) {
        await tx.rollback().execute();
        throw new Error(
            `event and ticket type initialization failed: ${error}`,
        );
    }
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

function ensureTicketType(): TicketTypeRow {
    if (!ticketType) {
        throw new Error("ticket_type test record not initialized");
    }
    return ticketType;
}

test("should insert one held reservation when capacity is available", async () => {
    await expect(
        createReservationService(executor()).create(
            1,
            1,
            ensureTicketType().id,
        ),
    ).resolves.toHaveProperty("id");
});

test("should fail when reservation quantity > ticket type capacity", async () => {
    await expect(
        createReservationService(executor()).create(
            101,
            1,
            ensureTicketType().id,
        ),
    ).rejects.toThrow();
});
