import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    expect,
    test,
} from "vitest";
import { sql, type ControlledTransaction } from "kysely";
import request from "supertest";

import { createApp, CreateReservationInput } from "../../app";
import { createDb, Database } from "../../db";
import { config } from "../../config";
import {
    createEventService,
    createReservationService,
    createTicketTypeService,
} from "../../services";
import { TicketTypeRow } from "../../repositories/ticket_type";
import { createUserService } from "../../services/user";
import { UserRow } from "../../repositories/user";

const testDb = createDb(config.testDbUrl);

const TICKET_TYPE_INVENTORY_CAPACITY = 10;
const USERS_TO_CREATE = TICKET_TYPE_INVENTORY_CAPACITY + 5;

let trx: ControlledTransaction<Database, []> | undefined;
let ticketType: TicketTypeRow | undefined;
let userIds: UserRow[] | undefined;

beforeEach(async () => {
    trx = await testDb.startTransaction().execute();
});

afterEach(async () => {
    await trx?.rollback().execute();
});

beforeAll(async () => {
    const tx = await testDb.startTransaction().execute();
    try {
        const event = await createEventService(tx).create("test", "test-venue");

        ticketType = await createTicketTypeService(
            tx,
        ).createWithTicketTypeInventory(
            event.id,
            "test-general",
            TICKET_TYPE_INVENTORY_CAPACITY,
        );

        userIds = await Promise.all(
            Array(USERS_TO_CREATE)
                .fill(null)
                .map(async (_, idx) => {
                    return await createUserService(tx).create(
                        `test-${idx}`,
                        `user-${idx}`,
                        `test-${idx}@user`,
                    );
                }),
        );

        await tx.commit().execute();
    } catch (error) {
        await tx.rollback().execute();
        throw new Error(
            `event and ticket type initialization failed: ${error}`,
        );
    }
});

afterAll(async () => {
    await sql`truncate table ${sql.table("reservation")} cascade`.execute(
        testDb,
    );
    await sql`truncate table ${sql.table("ticket_type_inventory")} cascade`.execute(
        testDb,
    );
    await sql`truncate table ${sql.table("ticket_type")} cascade`.execute(
        testDb,
    );
    await sql`truncate table ${sql.table("event")} cascade`.execute(testDb);
    await sql`truncate table ${sql.table("user")} cascade`.execute(testDb);
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

function ensureUserIds(): UserRow[] {
    if (!userIds) {
        throw new Error("userIds not initialized");
    }
    return userIds;
}

test("should insert one held reservation when capacity is available", async () => {
    await expect(
        createReservationService(executor()).create(
            1,
            ensureUserIds()[0].id,
            ensureTicketType().id,
        ),
    ).resolves.toHaveProperty("id");
});

test("should fail when reservation quantity > ticket type capacity", async () => {
    await expect(
        createReservationService(executor()).create(
            TICKET_TYPE_INVENTORY_CAPACITY + 1,
            ensureUserIds()[0].id,
            ensureTicketType().id,
        ),
    ).rejects.toThrow();
});

test("should concurrently reserve up to ticket type inventory capacity and reject the rest", async () => {
  const app = createApp(testDb)
    const requests = await Promise.all(
        ensureUserIds().map(async (u) => {
            return await request(app)
                .post("/reservations")
                .set("Accept", "application/json")
                .send<CreateReservationInput>({
                    user_id: u.id,
                    ticket_type_id: ensureTicketType().id,
                    quantity: 1,
                });
        }),
    );

    const successfulReservations = requests.filter(r => Object.hasOwn(r.body, "id"))
    expect(successfulReservations.length).toBe(TICKET_TYPE_INVENTORY_CAPACITY);
});
