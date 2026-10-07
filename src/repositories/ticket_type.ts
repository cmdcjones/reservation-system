import type { TxOrDb, TicketType } from "../db";

const ticketTypeColumns = ["id", "event_id", "name"] as const;

export type TicketTypeRow = Pick<
    TicketType,
    (typeof ticketTypeColumns)[number]
>;

export const ticketTypeRepository = {
    async insertOne(
        event_id: number,
        name: string,
        executor: TxOrDb,
    ): Promise<TicketTypeRow> {
        return await executor
            .insertInto("ticket_type")
            .values({ event_id, name })
            .returning(ticketTypeColumns)
            .executeTakeFirstOrThrow();
    },
};
