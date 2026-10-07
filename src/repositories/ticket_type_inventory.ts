import { sql } from "kysely";
import type { TxOrDb, TicketTypeInventory } from "../db";

const ticketTypeInventoryColumns = [
    "id",
    "ticket_type_id",
    "reserved",
    "capacity",
] as const;

export type TicketTypeInventoryRow = Pick<
    TicketTypeInventory,
    (typeof ticketTypeInventoryColumns)[number]
>;

export const ticketTypeInventoryRepository = {
    async insertOne(
        ticket_type_id: number,
        capacity: number,
        executor: TxOrDb,
    ): Promise<TicketTypeInventoryRow> {
        return await executor
            .insertInto("ticket_type_inventory")
            .values({ ticket_type_id, reserved: 0, capacity })
            .returning(ticketTypeInventoryColumns)
            .executeTakeFirstOrThrow();
    },

    async updateReservedByTicketTypeId(
        ticket_type_id: number,
        reserved: number,
        executor: TxOrDb,
    ): Promise<TicketTypeInventoryRow | undefined> {
        return await executor
            .updateTable("ticket_type_inventory")
            .set({ reserved: sql`reserved + ${reserved}` })
            .where("ticket_type_id", "=", ticket_type_id)
            .whereRef("reserved", "<=", "capacity")
            .returning(ticketTypeInventoryColumns)
            .executeTakeFirst();
    },
};
